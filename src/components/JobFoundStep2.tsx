'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface JobFoundStep2Props {
  onBack: () => void;
  onClose: () => void;
  onContinue: (data: JobFoundStep2Data) => void;
  initialData?: JobFoundStep2Data;
}

interface JobFoundStep2Data {
  feedback: string;
}

export default function JobFoundStep2({
  onBack,
  onClose,
  onContinue,
  initialData
}: JobFoundStep2Props) {
  const [feedback, setFeedback] = useState(initialData?.feedback || '');
  const [hasClickedContinue, setHasClickedContinue] = useState<boolean>(false);
  const minCharacters = 25;
  const currentCount = feedback.length;
  const isFormValid = currentCount >= minCharacters;

  const handleContinue = () => {
    if (isFormValid) {
      setHasClickedContinue(true);
      onContinue({ feedback });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="cancellation-modal-container">
        <div className="cancellation-modal">
          {/* Header */}
          <div className="modal-header">
            <div className="back-link">
              <button
                onClick={onBack}
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
                  <div className={`step ${hasClickedContinue ? 'active' : ''}`}></div>
                  <div className="step"></div>
                </div>
                <div className="progress-label">Step 2 of 3</div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="close-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {/* Left Content */}
            <div className="form-content">
              {/* Main Heading */}
              <div className="form-title">
                What's one thing you wish we could've helped you with?
              </div>

              {/* Subtitle */}
              <p style={{ 
                marginBottom: '20px', 
                fontSize: '18px', 
                color: 'var(--color-text-secondary)', 
                letterSpacing: '-0.8px',
                fontWeight: '400'
              }}>
                We're always looking to improve, your thoughts can help us make Migrate Mate more useful for others.*
              </p>

              {/* Text Area */}
              <div className="question-group" style={{ flex: 1, position: 'relative' }}>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder=""
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none font-['DM_Sans'] text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    minHeight: '200px',
                    fontFamily: 'var(--font-family-main)'
                  }}
                />
                
                {/* Character Counter - positioned at bottom right */}
                <div className="text-sm text-gray-500 font-['DM_Sans']" style={{ 
                  position: 'absolute', 
                  bottom: '12px', 
                  right: '12px',
                  pointerEvents: 'none'
                }}>
                  Min {minCharacters} characters ({currentCount}/{minCharacters})
                </div>
              </div>

              {/* Continue Button */}
              <div className="action-buttons" style={{ marginTop: '20px' }}>
                <button
                  onClick={handleContinue}
                  disabled={!isFormValid}
                  className={`btn ${isFormValid ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Right Side - Image */}
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
    </div>
  );
} 