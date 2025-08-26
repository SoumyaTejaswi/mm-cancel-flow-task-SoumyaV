// Simple in-memory rate limiting (in production, use Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiting configuration
 */
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: any) => string; // Custom key generator
}

/**
 * Default rate limit configuration
 */
const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  keyGenerator: (req: any) => {
    // Use IP address as key
    const ip = req.headers?.['x-forwarded-for'] || 
               req.headers?.['x-real-ip'] || 
               req.ip || 
               'unknown';
    return `rate_limit:${ip}`;
  }
};

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
  key: string, 
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const finalConfig = { ...defaultConfig, ...config };
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + finalConfig.windowMs
    };
  }
  
  // Check if request is allowed
  const allowed = entry.count < finalConfig.maxRequests;
  
  if (allowed) {
    entry.count++;
  }
  
  // Update store
  rateLimitStore.set(key, entry);
  
  return {
    allowed,
    remaining: Math.max(0, finalConfig.maxRequests - entry.count),
    resetTime: entry.resetTime
  };
}

/**
 * Rate limiting middleware for Next.js API routes
 */
export function rateLimitMiddleware(config: Partial<RateLimitConfig> = {}) {
  return function(req: any, res: any, next: any) {
    const finalConfig = { ...defaultConfig, ...config };
    const key = finalConfig.keyGenerator?.(req) || 'default';
    
    const result = checkRateLimit(key, finalConfig);
    
    if (!result.allowed) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        resetTime: result.resetTime
      });
    }
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', finalConfig.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.resetTime);
    
    next();
  };
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up expired rate limits every minute
setInterval(cleanupRateLimits, 60 * 1000);
