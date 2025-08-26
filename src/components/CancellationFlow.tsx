'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export interface CancellationData {
  userId: string;
  subscriptionId: string;
  downsellVariant: 'A' | 'B';
  reason?: string;
  acceptedDownsell: boolean;
}

export interface CancellationFlowProps {
  user: {
    id: string;
    email: string;
  };
  subscription: {
    id: string;
    monthlyPrice: number; // in cents
    status: string;
  };
  onComplete: (data: CancellationData) => void;
  onBack: () => void;
}



// Cancellation reasons
const cancellationReasons = [
  'Too expensive',
  'Not using it enough',
  'Found a better alternative',
  'Temporary pause',
  'Technical issues',
  'Other'
];

export default function CancellationFlow({
  user,
  subscription,
  onComplete,
  onBack
}: CancellationFlowProps) {
  const [currentStep, setCurrentStep] = useState<'loading' | 'job-question' | 'downsell' | 'reason' | 'confirm' | 'complete'>('loading');
  const [downsellVariant, setDownsellVariant] = useState<'A' | 'B' | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [acceptedDownsell, setAcceptedDownsell] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasFoundJob, setHasFoundJob] = useState<boolean | null>(null);

  // Initialize with Variant B (downsell) - no A/B testing
  useEffect(() => {
    setDownsellVariant('B');
    setCurrentStep('job-question'); // Start with the job question modal
  }, []);

  const handleJobQuestion = (foundJob: boolean) => {
    setHasFoundJob(foundJob);
    
    // Always go to downsell (Variant B)
    setCurrentStep('downsell');
  };

  const handleDownsellAccept = async () => {
    setAcceptedDownsell(true);
    setIsProcessing(true);
    
    // In a real app, you would:
    // 1. Update subscription price in Stripe/database
    // 2. Send confirmation email
    // 3. Log the action
    
    setTimeout(() => {
      setIsProcessing(false);
      onComplete({
        userId: user.id,
        subscriptionId: subscription.id,
        downsellVariant: downsellVariant!,
        acceptedDownsell: true
      });
    }, 2000);
  };

  const handleDownsellDecline = () => {
    setCurrentStep('reason');
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setCurrentStep('confirm');
  };

  const handleConfirmCancellation = async () => {
    setIsProcessing(true);
    
    try {
      // In a real app, you would:
      // 1. Create cancellation record in database
      // 2. Update subscription status to 'pending_cancellation'
      // 3. Schedule actual cancellation at period end
      // 4. Send confirmation email
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentStep('complete');
      
      // Call onComplete with cancellation data
      onComplete({
        userId: user.id,
        subscriptionId: subscription.id,
        downsellVariant: downsellVariant!,
        reason: selectedReason,
        acceptedDownsell: false
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      // Handle error state
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8952fc] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cancellation options...</p>
        </div>
      </div>
    );
  }

  // Job question modal (first step)
  if (currentStep === 'job-question') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden relative">
          {/* Subscription Cancellation Title */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <h3 className="text-sm font-medium text-gray-500">Subscription Cancellation</h3>
          </div>

          {/* Close button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Text and Interaction */}
            <div className="flex-1 p-8 lg:p-12">
              <div className="max-w-md">
                <h1 className="text-2xl lg:text-3xl text-gray-900 mb-2">
                  <span className="font-normal">Hey mate,</span>
                </h1>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Quick one before you go.
                </h1>
                
                <h2 className="text-3xl lg:text-4xl font-bold italic text-gray-900 mb-6">
                  Have you found a job yet?
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we can do better.
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => handleJobQuestion(true)}
                    className="w-full px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                  >
                    Yes, I've found a job
                  </button>
                  <button
                    onClick={() => handleJobQuestion(false)}
                    className="w-full px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                  >
                    Not yet - I'm still looking
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section - Empire State Building Image */}
            <div className="flex-1 relative h-64 lg:h-96">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                fill
                className="object-cover rounded-r-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Downsell screen (Variant B only) - Matching the Figma design
  if (currentStep === 'downsell') {
    const originalPrice = (subscription.monthlyPrice / 100).toFixed(0);
    const newPrice = (subscription.monthlyPrice / 2 / 100).toFixed(2); // 50% off
    
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden relative">
          {/* Header */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setCurrentStep('job-question')}
              className="text-gray-400 hover:text-gray-600 transition-colors flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Title and Progress */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <h3 className="text-sm font-medium text-gray-500">Subscription Cancellation</h3>
          </div>

          {/* Progress indicator */}
          <div className="absolute top-4 right-16 z-10 flex space-x-1">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>

          {/* Close button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Text and Offer */}
            <div className="flex-1 p-8 lg:p-12">
              <div className="max-w-md">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  We built this to help you land the job, this makes it a little easier.
                </h1>
                
                <p className="text-lg text-gray-600 mb-8">
                  We've been there and we're here to help you.
                </p>

                {/* 50% off offer box */}
                <div className="bg-purple-50 rounded-xl p-6 mb-6 border border-purple-200">
                  <p className="text-lg text-gray-900 mb-4">
                    Here's <span className="font-bold underline">50% off</span> until you find a job.
                  </p>
                  
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="text-3xl font-bold text-purple-700">${newPrice}/month</span>
                    <span className="text-lg text-gray-400 line-through">${originalPrice}/month</span>
                  </div>
                  
                  <button
                    onClick={handleDownsellAccept}
                    disabled={isProcessing}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 mb-3"
                  >
                    {isProcessing ? 'Processing...' : 'Get 50% off'}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    You won't be charged until your next billing date.
                  </p>
                </div>

                <button
                  onClick={handleDownsellDecline}
                  disabled={isProcessing}
                  className="w-full px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                >
                  No thanks
                </button>
              </div>
            </div>

            {/* Right Section - Empire State Building Image */}
            <div className="flex-1 relative h-64 lg:h-96">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                fill
                className="object-cover rounded-r-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reason selection screen
  if (currentStep === 'reason') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">We're sorry to see you go</h1>
                <button
                  onClick={onBack}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="px-6 py-8">
              <p className="text-gray-600 mb-6">
                To help us improve, could you tell us why you're cancelling?
              </p>

              <div className="space-y-3">
                {cancellationReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleReasonSelect(reason)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-[#8952fc] hover:bg-purple-50 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation screen
  if (currentStep === 'confirm') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Confirm Cancellation</h1>
                <button
                  onClick={onBack}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Confirmation Content */}
            <div className="px-6 py-8">
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h2>
                <p className="text-gray-600 mb-6">
                  Your subscription will be cancelled at the end of your current billing period.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Reason for cancellation:</p>
                  <p className="font-medium text-gray-900">{selectedReason}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConfirmCancellation}
                  disabled={isProcessing}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Yes, cancel my subscription'}
                </button>
                <button
                  onClick={onBack}
                  disabled={isProcessing}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  No, keep my subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completion screen
  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Cancellation Confirmed</h1>
              </div>
            </div>

            {/* Completion Content */}
            <div className="px-6 py-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Cancelled</h2>
              <p className="text-gray-600 mb-6">
                Your subscription has been cancelled. You'll continue to have access until the end of your current billing period.
              </p>
              
              <button
                onClick={onBack}
                className="w-full bg-[#8952fc] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#7b40fc] transition-colors"
              >
                Return to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 