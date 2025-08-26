'use client';

import React from 'react';
import Image from 'next/image';

interface JobFoundCompletionProps {
  onFinish: () => void;
  onBack: () => void;
}

export default function JobFoundCompletion({
  onFinish,
  onBack
}: JobFoundCompletionProps) {
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
                  <div className="step active"></div>
                  <div className="step active"></div>
                </div>
                <div className="progress-label">Step 3 of 3</div>
              </div>
            </div>

            <button
              onClick={onFinish}
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
                Congrats on the new role! 🎉
              </div>

              {/* Message */}
              <div className="mb-6">
                <p className="text-lg text-gray-900 mb-4">
                  We're stoked to hear you've landed a job and sorted your visa.
                </p>
                <p className="text-lg text-gray-900 mb-6">
                  Big congrats from the team. 🙌
                </p>
              </div>

              {/* Finish Button */}
              <div className="action-buttons">
                <button
                  onClick={onFinish}
                  className="btn btn-primary"
                >
                  Finish
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