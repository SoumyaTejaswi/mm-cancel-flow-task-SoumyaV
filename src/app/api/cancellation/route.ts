import { NextRequest, NextResponse } from 'next/server';
import { 
  getOrCreateDownsellVariant, 
  completeCancellation, 
  validateCancellationData,
  type CancellationData 
} from '@/lib/cancellationService';
import { 
  generateCSRFToken, 
  validateCSRFToken, 
  getSessionId 
} from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const sessionId = getSessionId(request);
    const rateLimitResult = checkRateLimit(`get:${sessionId}`, {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 50 // 50 requests per 5 minutes
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get or create A/B testing variant
    const variant = await getOrCreateDownsellVariant(userId);

    // Generate CSRF token for the response
    const csrfToken = generateCSRFToken();
    const response = NextResponse.json({ variant, csrfToken });
    
    // Set CSRF token in response headers
    response.headers.set('X-CSRF-Token', csrfToken);
    
    return response;
  } catch (error) {
    console.error('Error in GET /api/cancellation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const sessionId = getSessionId(request);
    const rateLimitResult = checkRateLimit(`post:${sessionId}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10 // 10 requests per 15 minutes (more restrictive for POST)
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // CSRF protection
    const csrfToken = request.headers.get('x-csrf-token');
    if (!csrfToken || !validateCSRFToken(sessionId, csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, subscriptionId, downsellVariant, reason, acceptedDownsell } = body;

    // Validate required fields
    if (!userId || !subscriptionId || !downsellVariant || typeof acceptedDownsell !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cancellationData: CancellationData = {
      userId,
      subscriptionId,
      downsellVariant,
      reason,
      acceptedDownsell
    };

    // Validate cancellation data
    if (!validateCancellationData(cancellationData)) {
      return NextResponse.json(
        { error: 'Invalid cancellation data' },
        { status: 400 }
      );
    }

    // Complete cancellation process
    await completeCancellation(cancellationData);

    return NextResponse.json({ 
      success: true,
      message: acceptedDownsell ? 'Downsell accepted' : 'Cancellation completed'
    });
  } catch (error) {
    console.error('Error in POST /api/cancellation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 