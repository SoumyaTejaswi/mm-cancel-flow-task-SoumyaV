import { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';

// CSRF token storage (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>();

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Store CSRF token with expiration
 */
export function storeCSRFToken(sessionId: string, token: string): void {
  const expires = Date.now() + (30 * 60 * 1000); // 30 minutes
  csrfTokens.set(sessionId, { token, expires });
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) {
    return false;
  }
  
  // Check if token has expired
  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  // Check if tokens match
  if (stored.token !== token) {
    return false;
  }
  
  return true;
}

/**
 * Extract session ID from request (simplified for demo)
 */
export function getSessionId(request: NextRequest): string {
  // In a real app, this would come from cookies or headers
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for') || request.ip || '';
  return `${userAgent}-${ip}`;
}

/**
 * Clean up expired tokens
 */
export function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(sessionId);
    }
  }
}

// Clean up expired tokens every 5 minutes
setInterval(cleanupExpiredTokens, 5 * 60 * 1000);
