import { createClient } from '@supabase/supabase-js';
import { isValidUUID, validateCancellationReason, sanitizeInput } from './security';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Server-side client with service role key for admin operations
const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface CancellationData {
  userId: string;
  subscriptionId: string;
  downsellVariant: 'A' | 'B';
  reason?: string;
  acceptedDownsell: boolean;
}

export interface CancellationRecord {
  id: string;
  user_id: string;
  subscription_id: string;
  downsell_variant: 'A' | 'B';
  reason?: string;
  accepted_downsell: boolean;
  created_at: string;
}

/**
 * Get or create A/B testing variant for a user
 * Uses cryptographically secure RNG and persists the variant
 */
export async function getOrCreateDownsellVariant(userId: string): Promise<'A' | 'B'> {
  try {
    // Check if user already has a variant assigned
    const { data: existingCancellation, error: fetchError } = await supabaseAdmin
      .from('cancellations')
      .select('downsell_variant')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Error fetching existing variant: ${fetchError.message}`);
    }

    // If variant already exists, return it
    if (existingCancellation) {
      return existingCancellation.downsell_variant;
    }

    // Generate new variant using cryptographically secure RNG
    const array = new Uint8Array(1);
    crypto.getRandomValues(array);
    const variant: 'A' | 'B' = array[0] % 2 === 0 ? 'A' : 'B';

    // Create initial cancellation record with variant
    const { error: insertError } = await supabaseAdmin
      .from('cancellations')
      .insert({
        user_id: userId,
        subscription_id: await getSubscriptionId(userId),
        downsell_variant: variant,
        accepted_downsell: false
      });

    if (insertError) {
      throw new Error(`Error creating cancellation record: ${insertError.message}`);
    }

    return variant;
  } catch (error) {
    console.error('Error in getOrCreateDownsellVariant:', error);
    // Fallback to variant A if there's an error
    return 'A';
  }
}

/**
 * Get subscription ID for a user
 */
async function getSubscriptionId(userId: string): Promise<string> {
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    throw new Error(`Error fetching subscription: ${error.message}`);
  }

  return subscription.id;
}

/**
 * Update cancellation record with final data
 */
export async function updateCancellationRecord(
  userId: string,
  data: Partial<CancellationData>
): Promise<void> {
  try {
    const updateData: any = {};
    
    if (data.reason !== undefined) {
      updateData.reason = data.reason;
    }
    
    if (data.acceptedDownsell !== undefined) {
      updateData.accepted_downsell = data.acceptedDownsell;
    }

    const { error } = await supabaseAdmin
      .from('cancellations')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error updating cancellation record: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating cancellation record:', error);
    throw error;
  }
}

/**
 * Mark subscription as pending cancellation
 */
export async function markSubscriptionPendingCancellation(userId: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'pending_cancellation' })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) {
      throw new Error(`Error updating subscription status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error marking subscription pending cancellation:', error);
    throw error;
  }
}

/**
 * Get cancellation record for a user
 */
export async function getCancellationRecord(userId: string): Promise<CancellationRecord | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('cancellations')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching cancellation record: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching cancellation record:', error);
    return null;
  }
}

/**
 * Complete cancellation process
 */
export async function completeCancellation(data: CancellationData): Promise<void> {
  try {
    // Sanitize and validate reason before storing
    const sanitizedReason = data.reason ? sanitizeInput(data.reason) : undefined;
    
    // Update cancellation record with final data
    await updateCancellationRecord(data.userId, {
      reason: sanitizedReason,
      acceptedDownsell: data.acceptedDownsell
    });

    // If downsell was not accepted, mark subscription as pending cancellation
    if (!data.acceptedDownsell) {
      await markSubscriptionPendingCancellation(data.userId);
    }

    // In a real application, you would also:
    // 1. Send confirmation emails
    // 2. Update Stripe subscription (if using Stripe)
    // 3. Schedule actual cancellation at period end
    // 4. Log analytics events
    
    console.log('Cancellation completed successfully:', data);
  } catch (error) {
    console.error('Error completing cancellation:', error);
    throw error;
  }
}

/**
 * Validate cancellation data with enhanced security
 */
export function validateCancellationData(data: CancellationData): boolean {
  // Check required fields
  if (!data.userId || !data.subscriptionId) {
    return false;
  }

  // Validate UUID format
  if (!isValidUUID(data.userId) || !isValidUUID(data.subscriptionId)) {
    return false;
  }

  // Validate downsell variant
  if (!['A', 'B'].includes(data.downsellVariant)) {
    return false;
  }

  // Validate boolean type
  if (typeof data.acceptedDownsell !== 'boolean') {
    return false;
  }

  // If downsell was not accepted, reason should be provided and validated
  if (!data.acceptedDownsell) {
    if (!data.reason) {
      return false;
    }
    
    // Validate and sanitize reason
    const validatedReason = validateCancellationReason(data.reason);
    if (!validatedReason) {
      return false;
    }
  }

  return true;
} 