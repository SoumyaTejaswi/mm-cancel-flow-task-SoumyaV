'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface JobFoundStep1Props {
  onBack: () => void;
  onClose: () => void;
  onContinue: (data: JobFoundData) => void;
  initialData?: JobFoundData;
}

interface JobFoundData {
  foundWithMigrateMate: 'Yes' | 'No' | null;
  rolesApplied: '0' | '1-5' | '6-20' | '20+' | null;
  companiesEmailed: '0' | '1-5' | '6-20' | '20+' | null;
  companiesInterviewed: '0' | '1-2' | '3-5' | '5+' | null;
}

export default function JobFoundStep1({
  onBack,
  onClose,
  onContinue,
  initialData
}: JobFoundStep1Props) {
  const [formData, setFormData] = useState<JobFoundData>(initialData || {
    foundWithMigrateMate: null,
    rolesApplied: null,
    companiesEmailed: null,
    companiesInterviewed: null
  });
  const [validationError, setValidationError] = useState<string>('');
  const [hasClickedContinue, setHasClickedContinue] = useState<boolean>(false);

  const handleOptionSelect = (field: keyof JobFoundData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user makes a selection
    setValidationError('');
    
    // Check for validation error when rolesApplied is selected
    if (field === 'rolesApplied') {
      if (formData.foundWithMigrateMate === 'Yes' && value === '0') {
        setValidationError('If you found your job with MigrateMate, you must have applied for at least 1 role through our platform.');
      }
    }
    
    // Check for validation error when foundWithMigrateMate is selected
    if (field === 'foundWithMigrateMate') {
      if (value === 'Yes' && formData.rolesApplied === '0') {
        setValidationError('If you found your job with MigrateMate, you must have applied for at least 1 role through our platform.');
      }
    }
  };

  const handleContinue = () => {
    // Check if all required fields are filled
    const isComplete = Object.values(formData).every(value => value !== null);
    
    // Check for validation error
    if (formData.foundWithMigrateMate === 'Yes' && formData.rolesApplied === '0') {
      setValidationError('If you found your job with MigrateMate, you must have applied for at least 1 role through our platform.');
      return;
    }
    
    if (isComplete && !validationError) {
      setHasClickedContinue(true);
      onContinue(formData);
    }
  };

  const isFormComplete = Object.values(formData).every(value => value !== null) && !validationError;

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
                  <div className={`step ${hasClickedContinue ? 'active' : ''}`}></div>
                  <div className="step"></div>
                  <div className="step"></div>
                </div>
                <div className="progress-label">Step 1 of 3</div>
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
                Congrats on the new role! 🎉
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {/* Question 1 */}
                <div className="question-group">
                  <p className="question-text">
                    Did you find this job with MigrateMate?*
                  </p>
                  <div className="options-group">
                    {['Yes', 'No'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect('foundWithMigrateMate', option)}
                        className={`option-button ${
                          formData.foundWithMigrateMate === option ? 'selected' : ''
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2 */}
                <div className="question-group">
                  <p className="question-text">
                    How many roles did you <u>apply</u> for through Migrate Mate?*
                  </p>
                  <div className="options-group">
                    {['0', '1-5', '6-20', '20+'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect('rolesApplied', option)}
                        className={`option-button ${
                          formData.rolesApplied === option ? 'selected' : ''
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3 */}
                <div className="question-group">
                  <p className="question-text">
                    How many companies did you <u>email</u> directly?*
                  </p>
                  <div className="options-group">
                    {['0', '1-5', '6-20', '20+'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect('companiesEmailed', option)}
                        className={`option-button ${
                          formData.companiesEmailed === option ? 'selected' : ''
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 4 */}
                <div className="question-group">
                  <p className="question-text">
                    How many different companies did you <u>interview</u> with?*
                  </p>
                  <div className="options-group">
                    {['0', '1-2', '3-5', '5+'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect('companiesInterviewed', option)}
                        className={`option-button ${
                          formData.companiesInterviewed === option ? 'selected' : ''
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Validation Error Message */}
              {validationError && (
                <div className="error-message">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-red-700 text-sm font-medium">{validationError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <div className="action-buttons" style={{ marginTop: '20px' }}>
                <button
                  onClick={handleContinue}
                  disabled={!isFormComplete}
                  className={`btn ${isFormComplete ? 'btn-primary' : 'btn-secondary'}`}
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