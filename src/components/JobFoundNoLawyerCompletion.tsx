'use client';

import React from 'react';
import Image from 'next/image';

interface JobFoundNoLawyerCompletionProps {
  onFinish: () => void;
  onBack: () => void;
}

export default function JobFoundNoLawyerCompletion({
  onFinish,
  onBack
}: JobFoundNoLawyerCompletionProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
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
              <div className="text-2xl font-bold text-gray-900 mb-4">
                Your cancellation's all sorted, mate,<br />
                no more charges.
              </div>

              {/* Contact Information Block */}
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start space-x-4">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    <Image
                      src="/mihailo-profile.jpeg"
                      alt="Mihailo Bozic"
                      width={48}
                      height={48}
                      className="rounded-full"
                      priority
                    />
                  </div>
                  
                  {/* Contact Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-0">Mihailo Bozic</h3>
                    <p className="text-gray-600 text-sm mb-3">&lt;mihailo@migratemate.co&gt;</p>
                    <p className="text-gray-700 text-xs font-bold mb-2">
                      I'll be reaching out soon to help with the visa side of things.
                    </p>
                    <p className="text-gray-700 text-sm mb-2">
                      We've got your back, whether it's questions, paperwork, or just figuring out your options.
                    </p>
                    <p className="text-gray-700 text-sm">
                      Keep an eye on your inbox, I'll be in touch <span className="underline">shortly</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Finish Button */}
              <div className="action-buttons">
                <button
                  onClick={onFinish}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
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