'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  completeCancellation, 
  validateCancellationData,
  type CancellationData 
} from '@/lib/cancellationService';
import JobFoundStep1 from '@/components/JobFoundStep1';
import JobFoundStep2 from '@/components/JobFoundStep2';
import JobFoundStep3 from '@/components/JobFoundStep3';
import JobFoundStep3Feedback from '@/components/JobFoundStep3Feedback';
import JobFoundCompletion from '@/components/JobFoundCompletion';
import JobFoundNoLawyerCompletion from '@/components/JobFoundNoLawyerCompletion';

// Mock user and subscription data (in real app, this would come from Supabase)
const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'user@example.com'
};

const mockSubscription = {
  id: 'sub_123',
  monthlyPrice: 2500, // $25.00 in cents
  status: 'active'
};

// Cancellation reasons from the Figma design
const cancellationReasons = [
  'Too expensive',
  'Platform not helpful',
  'Not enough relevant jobs',
  'Decided not to move',
  'Other'
];

export default function CancelPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'loading' | 'job-question' | 'job-found-step1' | 'job-found-step2' | 'job-found-step3' | 'job-found-step3-feedback' | 'job-found-completion' | 'job-found-no-lawyer-completion' | 'downsell' | 'downsell-success' | 'usage-survey' | 'reason' | 'confirm' | 'cancellation-complete' | 'downsell-cancellation-complete'>('loading');
  const [downsellVariant, setDownsellVariant] = useState<'A' | 'B' | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [acceptedDownsell, setAcceptedDownsell] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasFoundJob, setHasFoundJob] = useState<boolean | null>(null);
  const [jobFoundData, setJobFoundData] = useState<any>(null);
  const [jobFoundStep2Data, setJobFoundStep2Data] = useState<any>(null);
  const [jobFoundStep3Data, setJobFoundStep3Data] = useState<any>(null);
  const [usageSurveyData, setUsageSurveyData] = useState({
    rolesApplied: '',
    companiesEmailed: '',
    companiesInterviewed: ''
  });
  const [showReasonError, setShowReasonError] = useState(false);
  const [showPriceQuestion, setShowPriceQuestion] = useState(false);
  const [showPlatformQuestion, setShowPlatformQuestion] = useState(false);
  const [showOtherQuestion, setShowOtherQuestion] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [platformFeedback, setPlatformFeedback] = useState('');
  const [otherFeedback, setOtherFeedback] = useState('');
  const [showPlatformError, setShowPlatformError] = useState(false);
  const [showOtherError, setShowOtherError] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);
  const [previousStep, setPreviousStep] = useState<'job-found-step3' | 'job-found-step3-feedback'>('job-found-step3');
  const [previousStepNoLawyer, setPreviousStepNoLawyer] = useState<'job-found-step3' | 'job-found-step3-feedback'>('job-found-step3');

  const [csrfToken, setCsrfToken] = useState<string>('');

  // Initialize with proper A/B testing
  useEffect(() => {
    const initializeVariant = async () => {
      try {
        // Call API to get or create A/B testing variant
        const response = await fetch(`/api/cancellation?userId=${mockUser.id}`);
        const data = await response.json();
        
        if (data.variant) {
          setDownsellVariant(data.variant);
          setCsrfToken(data.csrfToken || '');
          setCurrentStep('job-question');
        } else {
          console.error('Failed to get variant');
          setCurrentStep('job-question');
        }
      } catch (error) {
        console.error('Error initializing variant:', error);
        setCurrentStep('job-question');
      }
    };

    initializeVariant();
  }, [mockUser.id]);

  const handleJobQuestion = (foundJob: boolean) => {
    setHasFoundJob(foundJob);
    
    if (foundJob) {
      // If user found a job, go to Step 1 of 3
      // Clear any previously stored job found data to start fresh
      setJobFoundData(null);
      setJobFoundStep2Data(null);
      setJobFoundStep3Data(null);
      setCurrentStep('job-found-step1');
    } else {
      // If user is still looking, check A/B variant
      if (downsellVariant === 'A') {
        // Variant A: No downsell, go directly to usage survey
        setCurrentStep('usage-survey');
      } else {
        // Variant B: Show downsell offer
        setCurrentStep('downsell');
      }
    }
  };

  const handleDownsellAccept = async () => {
    setAcceptedDownsell(true);
    setIsProcessing(true);
    
    try {
      const cancellationData: CancellationData = {
        userId: mockUser.id,
        subscriptionId: mockSubscription.id,
        downsellVariant: downsellVariant!,
        acceptedDownsell: true
      };

      if (!validateCancellationData(cancellationData)) {
        throw new Error('Invalid cancellation data');
      }

      // Send request with CSRF token
      const response = await fetch('/api/cancellation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(cancellationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Cancellation failed');
      }
      
      // In a real app, you would also update the subscription price in Stripe
      console.log('Downsell accepted - subscription price updated');
      
      setCurrentStep('downsell-success'); // Navigate to success page instead of profile
    } catch (error) {
      console.error('Error accepting downsell:', error);
      // Handle error state
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownsellDecline = () => {
    setCurrentStep('usage-survey');
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setCurrentStep('confirm');
  };

  const handleConfirmCancellation = async () => {
    setIsProcessing(true);
    
    try {
      const cancellationData: CancellationData = {
        userId: mockUser.id,
        subscriptionId: mockSubscription.id,
        downsellVariant: downsellVariant!,
        reason: selectedReason,
        acceptedDownsell: false
      };

      if (!validateCancellationData(cancellationData)) {
        throw new Error('Invalid cancellation data');
      }

      // Send request with CSRF token
      const response = await fetch('/api/cancellation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(cancellationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Cancellation failed');
      }
      
      setCurrentStep('downsell-cancellation-complete');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      // Handle error state
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToProfile = () => {
    router.push('/');
  };

  const handleJobFoundStep1Back = () => {
    setCurrentStep('job-question');
  };

  const handleJobFoundStep1Continue = (data: any) => {
    setJobFoundData(data);
    // Go to Step 2 of 3
    setCurrentStep('job-found-step2');
  };

  const handleJobFoundStep2Back = () => {
    setCurrentStep('job-found-step1');
  };

  const handleJobFoundStep2Continue = (data: any) => {
    setJobFoundStep2Data(data);
    // Go to Step 3 (visa question) after Step 2
    setCurrentStep('job-found-step3');
  };

  const handleJobFoundStep3Back = () => {
    setCurrentStep('job-found-step2');
  };

  const handleJobFoundStep3Complete = (data: any) => {
    setJobFoundStep3Data(data);
    // Complete the cancellation process for users who found job with MigrateMate
    // This could include saving the visa data and completing cancellation
    console.log('Job found with MigrateMate - completing cancellation with visa data:', data);
    
    // Check if they have immigration lawyer support (answered "Yes")
    if (data.companyProvidingLawyer === 'Yes') {
      // Navigate directly to subscription cancelled page
      setPreviousStep('job-found-step3');
      setCurrentStep('cancellation-complete');
    } else {
      // Show the custom completion screen for users without lawyer support (with Mihailo's contact)
      setPreviousStepNoLawyer('job-found-step3');
      setCurrentStep('job-found-no-lawyer-completion');
    }
  };

  const handleJobFoundCompletionBack = () => {
    setCurrentStep('job-found-step3');
  };

  const handleJobFoundCompletionFinish = () => {
    // Return to profile page after custom completion
    router.push('/');
  };

  const handleJobFoundNoLawyerCompletionBack = () => {
    setCurrentStep(previousStepNoLawyer);
  };

  const handleJobFoundNoLawyerCompletionFinish = () => {
    // Return to profile page after custom completion
    router.push('/');
  };

  const handleJobFoundStep3FeedbackBack = () => {
    setCurrentStep('job-found-step2');
  };

  const handleJobFoundStep3FeedbackContinue = (data: any) => {
    // Check if they have immigration lawyer support (answered "Yes")
    if (data.companyProvidingLawyer === 'Yes') {
      // Navigate directly to subscription cancelled page
      setPreviousStep('job-found-step3-feedback');
      setCurrentStep('cancellation-complete');
    } else {
      // Show the custom completion screen for users without lawyer support (with Mihailo's contact)
      setPreviousStepNoLawyer('job-found-step3-feedback');
      setCurrentStep('job-found-no-lawyer-completion');
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
      <div id="cancellation-modal">
        <div className="modal-card">
          {/* Modal Header */}
          <div className="modal-header">
            <h3 className="modal-title">Subscription Cancellation</h3>
            <button
              onClick={handleBackToProfile}
              className="close-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {/* Content Column */}
            <div className="content-column">
              {/* Headings */}
              <div className="headings">
                <h1 className="main-heading">
                  <span style={{fontWeight: '400'}}>Hey mate,</span>
                </h1>
                <h1 className="main-heading">
                  Quick one before you go.
                </h1>
                <h2 className="sub-heading" style={{fontStyle: 'italic'}}>
                  Have you found a job yet?
                </h2>
              </div>

              {/* Description */}
              <p className="description">
                Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we can do better.
              </p>

              {/* Divider */}
              <hr className="divider" />

              {/* CTA Group */}
              <div className="cta-group">
                <button
                  onClick={() => handleJobQuestion(true)}
                  className="cta-button"
                >
                  Yes, I've found a job
                </button>
                <button
                  onClick={() => handleJobQuestion(false)}
                  className="cta-button"
                >
                  Not yet - I'm still looking
                </button>
              </div>
            </div>

            {/* Image Column */}
            <div className="image-column">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                width={400}
                height={333}
                className="modal-image"
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
    const originalPrice = (mockSubscription.monthlyPrice / 100).toFixed(0);
    const newPrice = (mockSubscription.monthlyPrice / 2 / 100).toFixed(2); // 50% off
    
    return (
      <div className="page-overlay">
        <div className="offer-modal">
          {/* Modal Header */}
          <div className="modal-header">
            <button
              onClick={() => setCurrentStep('job-question')}
              className="back-link"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L7 12L15 5" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>

            <div className="progress-indicator">
              <span className="title">Subscription Cancellation</span>
              <div className="progress-steps">
                <div className="step active"></div>
                <div className="step"></div>
                <div className="step"></div>
              </div>
              <span className="step-label">Step 1 of 3</span>
            </div>

            <button
              onClick={handleBackToProfile}
              className="close-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {/* Content Column */}
            <div className="content-column">
              <h1 className="main-heading">
                We built this to help you land the job, this makes it a little easier.
              </h1>
              
              <p className="sub-heading">
                We've been there and we're here to help you.
              </p>

              {/* Offer Box */}
              <div className="offer-box">
                <div className="offer-details">
                  <h2 className="offer-title">
                    Here's <u>50% off</u> until you find a job.
                  </h2>
                  
                  <div className="price-container">
                    <span className="new-price">${newPrice}<span>/month</span></span>
                    <span className="old-price">${originalPrice}/month</span>
                  </div>
                </div>

                <div className="offer-cta-group">
                  <button
                    onClick={handleDownsellAccept}
                    disabled={isProcessing}
                    className="cta-primary"
                  >
                    {isProcessing ? 'Processing...' : 'Get 50% off'}
                  </button>
                  <p className="cta-note">
                    You won't be charged until your next billing date.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <hr className="divider" />

              {/* Secondary CTA */}
              <button
                onClick={handleDownsellDecline}
                disabled={isProcessing}
                className="cta-secondary"
              >
                No thanks
              </button>
            </div>

            {/* Image Column */}
            <div className="image-column">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                width={400}
                height={333}
                className="modal-image"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Downsell success screen
  if (currentStep === 'downsell-success') {
    const newPrice = (mockSubscription.monthlyPrice / 2 / 100).toFixed(2); // 50% off
    const currentDate = new Date();
    const nextBillingDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const daysLeft = Math.ceil((nextBillingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="subscription-section">
        <div className="subscription-card">
          {/* Header */}
          <div className="subscription-header">
            <h3 className="subscription-title">Subscription</h3>
            <button
              onClick={() => setCurrentStep('downsell')}
              className="subscription-close-btn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="card-body">
            {/* Left Section - Text and Success Message */}
            <div className="content-left">
              <div className="main-title">
                <span className="title-line-1">Great choice, mate!</span>
                <span className="title-line-2">You're still on the path to your dream role.</span>
                <span className="highlight">Let's make it happen together!</span>
              </div>

              {/* Subscription Details */}
              <div className="plan-info">
                You've got XX days left on your current plan.
                <br />
                Starting from XX date, your monthly payment will be ${newPrice}.
                <span className="note">
                  You can cancel anytime before then.
                </span>
              </div>

              {/* Call to Action Button */}
              <button
                onClick={() => setCurrentStep('usage-survey')}
                className="cta-link"
              >
                Land your dream role
              </button>
            </div>

            {/* Right Section - Image */}
            <div className="content-right">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                width={400}
                height={333}
                className="subscription-image"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Usage survey screen
  if (currentStep === 'usage-survey') {
    const originalPrice = (mockSubscription.monthlyPrice / 100).toFixed(0);
    const newPrice = (mockSubscription.monthlyPrice / 2 / 100).toFixed(2); // 50% off
    
    const handleSurveyOptionChange = (question: string, value: string) => {
      setUsageSurveyData(prev => ({
        ...prev,
        [question]: value
      }));
    };

    const handleSurveyContinue = () => {
      setStep2Completed(true);
      setCurrentStep('reason');
      setShowReasonError(true);
      setTimeout(() => {
        setShowReasonError(false);
      }, 3000);
    };

    const handleSurveyDownsell = () => {
      setCurrentStep('downsell-success');
    };
    
    return (
      <div className="cancellation-modal-container">
        <div className="cancellation-modal">
          {/* Header */}
          <div className="modal-header">
            <div className="back-link">
              <button
                onClick={() => setCurrentStep('downsell')}
                className="back-button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
            </div>

            <div className="progress-info">
              <div className="progress-title">Subscription Cancellation</div>
              <div className="progress-indicator">
                <div className="progress-steps">
                  <div className="step active"></div>
                  <div className={`step ${step2Completed ? 'active' : ''}`}></div>
                  <div className="step"></div>
                </div>
                <div className="progress-label">Step 2 of 3</div>
              </div>
            </div>

            <button
              onClick={handleBackToProfile}
              className="close-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {/* Left Section - Survey Questions */}
            <div className="form-content">
              <div className="form-title">
                Help us understand how you were using Migrate Mate.
              </div>
                
              {/* Question 1 */}
              <div className="mb-6">
                <p className="text-lg text-gray-900 mb-4">
                  How many roles did you <u>apply</u> for through Migrate Mate?
                </p>
                <div className="flex space-x-2">
                  {['0', '1-5', '6-20', '20+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSurveyOptionChange('rolesApplied', option)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        usageSurveyData.rolesApplied === option
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="mb-6">
                <p className="text-lg text-gray-900 mb-4">
                  How many companies did you <u>email</u> directly?
                </p>
                <div className="flex space-x-2">
                  {['0', '1-5', '6-20', '20+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSurveyOptionChange('companiesEmailed', option)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        usageSurveyData.companiesEmailed === option
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="mb-8">
                <p className="text-lg text-gray-900 mb-4">
                  How many different companies did you <u>interview</u> with?
                </p>
                <div className="flex space-x-2">
                  {['0', '1-2', '3-5', '5+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSurveyOptionChange('companiesInterviewed', option)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        usageSurveyData.companiesInterviewed === option
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                {/* Get 50% off Button */}
                <button
                  onClick={handleSurveyDownsell}
                  className="btn btn-primary"
                >
                  Get 50% off | ${newPrice} <span className="strikethrough">${originalPrice}</span>
                </button>

                {/* Continue Button */}
                <button
                  onClick={handleSurveyContinue}
                  disabled={!usageSurveyData.rolesApplied || !usageSurveyData.companiesEmailed || !usageSurveyData.companiesInterviewed}
                  className="btn btn-secondary"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Right Section - Empire State Building Image */}
            <div className="image-content">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                width={400}
                height={333}
                className="subscription-image"
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
    const originalPrice = (mockSubscription.monthlyPrice / 100).toFixed(0);
    const newPrice = (mockSubscription.monthlyPrice / 2 / 100).toFixed(2); // 50% off
    
    // Check if Step 3 is completed (reason selected + follow-up question answered)
    const isStep3Completed = selectedReason && (
      (selectedReason === 'Too expensive' && maxPrice) ||
      (selectedReason === 'Platform not helpful' && platformFeedback.length >= 25) ||
      (showOtherQuestion && otherFeedback.length >= 25)
    );
    
    return (
      <div className="cancellation-modal-container">
        <div className="cancellation-modal">
          {/* Header */}
          <div className="modal-header">
            <div className="back-link">
              <button
                onClick={() => {
                  setCurrentStep('usage-survey');
                  setStep2Completed(false);
                  setSelectedReason('');
                  setShowPriceQuestion(false);
                  setShowPlatformQuestion(false);
                  setShowOtherQuestion(false);
                  setMaxPrice('');
                  setPlatformFeedback('');
                  setOtherFeedback('');
                  setShowPlatformError(false);
                  setShowOtherError(false);
                }}
                className="back-button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
            </div>

            <div className="progress-info">
              <div className="progress-title">Subscription Cancellation</div>
              <div className="progress-indicator">
                <div className="progress-steps">
                  <div className="step active"></div>
                  <div className="step active"></div>
                  <div className={`step ${isStep3Completed ? 'active' : ''}`}></div>
                </div>
                <div className="progress-label">Step 3 of 3</div>
              </div>
            </div>

            <button
              onClick={handleBackToProfile}
              className="close-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {/* Left Section - Reason Selection */}
            <div className="form-content">
              <div className="form-title">
                What's the main reason for cancelling?
              </div>
              
              <p className="text-lg text-gray-600 mb-4 font-bold">
                Please take a minute to let us know why:
              </p>

              {/* Error Message */}
              {showReasonError && (
                <div className="mb-6">
                  <p className="text-red-600 text-sm font-medium">
                    To help us understand your experience, please select a reason for cancelling*
                  </p>
                </div>
              )}

              {/* Reason Options - Show all options if special questions are not shown yet */}
              {!(selectedReason === 'Too expensive' && showPriceQuestion) && !(selectedReason === 'Platform not helpful' && showPlatformQuestion) && !(showOtherQuestion) && (
                <div className="space-y-4 mb-8">
                  {cancellationReasons.map((reason) => (
                    <label key={reason} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => {
                          setSelectedReason(e.target.value);
                          if (e.target.value === 'Too expensive') {
                            setShowPriceQuestion(true);
                            setShowPlatformQuestion(false);
                            setShowOtherQuestion(false);
                          } else if (e.target.value === 'Platform not helpful') {
                            setShowPlatformQuestion(true);
                            setShowPriceQuestion(false);
                            setShowOtherQuestion(false);
                            setShowPlatformError(true);
                            setTimeout(() => {
                              setShowPlatformError(false);
                            }, 2000);
                          } else if (e.target.value === 'Not enough relevant jobs' || e.target.value === 'Decided not to move' || e.target.value === 'Other') {
                            setShowOtherQuestion(true);
                            setShowPriceQuestion(false);
                            setShowPlatformQuestion(false);
                            setShowOtherError(true);
                            setTimeout(() => {
                              setShowOtherError(false);
                            }, 2000);
                          } else {
                            setShowPriceQuestion(false);
                            setShowPlatformQuestion(false);
                            setShowOtherQuestion(false);
                          }
                        }}
                        className="mr-3 w-4 h-4 text-black focus:ring-black border-gray-300"
                      />
                      <span className="text-gray-700 text-base">{reason}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Show only "Too expensive" option and price input when selected and price question is shown */}
              {selectedReason === 'Too expensive' && showPriceQuestion && (
                <div className="mb-8">
                  <div className="flex items-center cursor-pointer mb-6">
                    <input
                      type="radio"
                      name="cancellationReason"
                      value="Too expensive"
                      checked={true}
                      onChange={() => {}}
                      className="mr-3 w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-gray-700 text-base">Too expensive</span>
                  </div>
                  
                  <p className="text-lg text-gray-900 mb-4">
                    What would be the maximum you would be willing to pay?*
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    />
                  </div>
                </div>
              )}

              {/* Show only "Platform not helpful" option and feedback textarea when selected */}
              {selectedReason === 'Platform not helpful' && showPlatformQuestion && (
                <div className="mb-8">
                  <div className="flex items-center cursor-pointer mb-6">
                    <input
                      type="radio"
                      name="cancellationReason"
                      value="Platform not helpful"
                      checked={true}
                      onChange={() => {}}
                      className="mr-3 w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-gray-700 text-base">Platform not helpful</span>
                  </div>
                  
                  <p className="text-lg text-gray-900 mb-4">
                    What can we change to make the platform more helpful?*
                  </p>

                  {/* Error Message */}
                  {showPlatformError && (
                    <div className="mb-4">
                      <p className="text-red-600 text-sm font-medium">
                        Please enter at least 25 characters so we can understand your feedback*
                      </p>
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      value={platformFeedback}
                      onChange={(e) => setPlatformFeedback(e.target.value)}
                      placeholder="Tell us what we can improve..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({platformFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {/* Show only other options and feedback textarea when selected */}
              {showOtherQuestion && (
                <div className="mb-8">
                  <div className="flex items-center cursor-pointer mb-6">
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={selectedReason}
                      checked={true}
                      onChange={() => {}}
                      className="mr-3 w-4 h-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-gray-700 text-base">{selectedReason}</span>
                  </div>
                  
                  <p className="text-lg text-gray-900 mb-4">
                    {selectedReason === 'Not enough relevant jobs' && "In which way can we make the jobs more relevant?*"}
                    {selectedReason === 'Decided not to move' && "What would have helped you the most?*"}
                    {selectedReason === 'Other' && "What would have helped you the most?*"}
                  </p>

                  {/* Error Message */}
                  {showOtherError && (
                    <div className="mb-4">
                      <p className="text-red-600 text-sm font-medium">
                        Please enter at least 25 characters so we can understand your feedback*
                      </p>
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      value={otherFeedback}
                      onChange={(e) => setOtherFeedback(e.target.value)}
                      placeholder="Tell us what we can improve..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({otherFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                {/* Get 50% off Button */}
                <button
                  onClick={() => setCurrentStep('downsell-success')}
                  className="btn btn-primary"
                >
                  Get 50% off | ${newPrice} <span className="line-through">${originalPrice}</span>
                </button>

                {/* Complete Cancellation Button */}
                <button
                  onClick={handleConfirmCancellation}
                  disabled={!selectedReason || 
                    (selectedReason === 'Too expensive' && !maxPrice) ||
                    (selectedReason === 'Platform not helpful' && platformFeedback.length < 25) ||
                    (showOtherQuestion && otherFeedback.length < 25)
                  }
                  className="btn btn-secondary"
                >
                  Complete cancellation
                </button>
              </div>
            </div>

            {/* Right Section - Empire State Building Image */}
            <div className="image-content">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                width={400}
                height={333}
                className="subscription-image"
                priority
              />
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
                  onClick={handleBackToProfile}
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
                  onClick={handleBackToProfile}
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

  // Cancellation completion screen
  if (currentStep === 'cancellation-complete') {
    return (
      <div className="cancellation-modal-container">
        <div className="cancellation-modal">
          {/* Header */}
          <div className="modal-header">
            <div className="back-link">
              {/* Back button removed */}
            </div>

            <div className="progress-info">
              <div className="progress-title">Subscription Cancelled</div>
              <div className="progress-indicator">
                <div className="progress-steps">
                  <div className="step active"></div>
                  <div className="step active"></div>
                  <div className="step active"></div>
                </div>
                <div className="progress-label">Completed</div>
              </div>
            </div>

            <button
              onClick={handleBackToProfile}
              className="close-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {/* Left Section - Completion Message */}
            <div className="form-content">
              <div className="form-title">
                All done, your cancellation's been processed.
              </div>
              
              <p className="text-sm text-gray-900 mb-2 font-bold">
                We're stoked to hear you've landed a job and sorted your visa.
              </p>
              <p className="text-sm text-gray-900 mb-4 font-bold">
                Big congrats from the team. 🙌
              </p>

              {/* Call to Action Button */}
              <button
                onClick={handleBackToProfile}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-lg"
              >
                Finish
              </button>
            </div>

            {/* Right Section - Empire State Building Image */}
            <div className="image-content">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                width={400}
                height={333}
                className="subscription-image"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Job Found Step 1
  if (currentStep === 'job-found-step1') {
    return (
      <JobFoundStep1
        onBack={handleJobFoundStep1Back}
        onClose={handleBackToProfile}
        onContinue={handleJobFoundStep1Continue}
        initialData={jobFoundData}
      />
    );
  }

  // Job Found Step 2
  if (currentStep === 'job-found-step2') {
    return (
      <JobFoundStep2
        onBack={handleJobFoundStep2Back}
        onClose={handleBackToProfile}
        onContinue={handleJobFoundStep2Continue}
        initialData={jobFoundStep2Data}
      />
    );
  }

  // Job Found Step 3
  if (currentStep === 'job-found-step3') {
    return (
      <JobFoundStep3
        onBack={handleJobFoundStep3Back}
        onClose={handleBackToProfile}
        onCompleteCancellation={handleJobFoundStep3Complete}
        initialData={jobFoundStep3Data}
      />
    );
  }

  // Job Found Completion (for users with immigration lawyer support)
  if (currentStep === 'job-found-completion') {
    return (
      <JobFoundCompletion
        onFinish={handleJobFoundCompletionFinish}
        onBack={handleJobFoundCompletionBack}
      />
    );
  }

  // Job Found Step 3 Feedback (for users who didn't find job with MigrateMate)
  if (currentStep === 'job-found-step3-feedback') {
    return (
      <JobFoundStep3Feedback
        onBack={handleJobFoundStep3FeedbackBack}
        onClose={handleBackToProfile}
        onContinue={handleJobFoundStep3FeedbackContinue}
      />
    );
  }

  // Job Found No Lawyer Completion (for users without immigration lawyer support)
  if (currentStep === 'job-found-no-lawyer-completion') {
    return (
      <JobFoundNoLawyerCompletion
        onFinish={handleJobFoundNoLawyerCompletionFinish}
        onBack={handleJobFoundNoLawyerCompletionBack}
      />
    );
  }

  // Downsell Cancellation Completion (for users who haven't found a job)
  if (currentStep === 'downsell-cancellation-complete') {
    return (
      <div className="cancellation-modal-container">
        <div className="cancellation-modal">
          {/* Header */}
          <div className="modal-header">
            <div className="back-link">
              <button
                onClick={() => setCurrentStep('reason')}
                className="back-button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
            </div>

            <div className="progress-info">
              <div className="progress-title">Subscription Cancelled</div>
              <div className="progress-indicator">
                <div className="progress-steps">
                  <div className="step active"></div>
                  <div className="step active"></div>
                  <div className="step active"></div>
                </div>
                <div className="progress-label">Completed</div>
              </div>
            </div>

            <button
              onClick={handleBackToProfile}
              className="close-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {/* Left Section - Completion Message */}
            <div className="form-content">
              <div className="form-title">
                Sorry to see you go, mate.
              </div>
              
              <p className="text-lg text-gray-900 mb-4 font-bold">
                Thanks for being with us, and you're always welcome back.
              </p>

              {/* Subscription Details */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-0 font-bold">
                  Your subscription is set to end on XX date.
                </p>
                <p className="text-sm text-gray-600 font-bold mb-3">
                  You'll still have full access until then. No further charges after that.
                </p>
                <p className="text-sm text-gray-600 mb-0">
                  Changed your mind? You can reactivate anytime before your end date.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 mt-1 mb-4"></div>

              {/* Call to Action Button */}
              <button
                onClick={handleBackToProfile}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Back to Jobs
              </button>
            </div>

            {/* Right Section - Empire State Building Image */}
            <div className="image-content">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                width={400}
                height={333}
                className="subscription-image"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 