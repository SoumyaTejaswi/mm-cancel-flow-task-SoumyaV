'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface JobFoundStep3Props {
  onBack: () => void;
  onClose: () => void;
  onCompleteCancellation: (data: JobFoundStep3Data) => void;
  initialData?: JobFoundStep3Data;
}

interface JobFoundStep3Data {
  companyProvidingLawyer: 'Yes' | 'No' | null;
  visaType?: string;
}

export default function JobFoundStep3({
  onBack,
  onClose,
  onCompleteCancellation,
  initialData
}: JobFoundStep3Props) {
  const [companyProvidingLawyer, setCompanyProvidingLawyer] = useState<'Yes' | 'No' | null>(null);
  const [visaType, setVisaType] = useState<string>('');
  const [hasClickedContinue, setHasClickedContinue] = useState<boolean>(false);
  const [hasAnsweredFollowUp, setHasAnsweredFollowUp] = useState<boolean>(false);

  const handleCompleteCancellation = () => {
    if (companyProvidingLawyer !== null) {
      if ((companyProvidingLawyer === 'Yes' || companyProvidingLawyer === 'No') && visaType.trim() === '') {
        // If they have selected either option but haven't entered visa type, don't proceed
        return;
      }
      
      const data: JobFoundStep3Data = {
        companyProvidingLawyer,
        ...((companyProvidingLawyer === 'Yes' || companyProvidingLawyer === 'No') && { visaType: visaType.trim() })
      };
      
      setHasClickedContinue(true);
      onCompleteCancellation(data);
    }
  };

  const handleOptionSelect = (option: 'Yes' | 'No') => {
    setCompanyProvidingLawyer(option);
    setHasAnsweredFollowUp(false);
  };

  const handleVisaTypeChange = (value: string) => {
    setVisaType(value);
    if (value.trim() !== '') {
      setHasAnsweredFollowUp(true);
    } else {
      setHasAnsweredFollowUp(false);
    }
  };

  const isFormValid = companyProvidingLawyer !== null && 
    ((companyProvidingLawyer === 'Yes' || companyProvidingLawyer === 'No') ? visaType.trim() !== '' : true);

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
                  <div className={`step ${hasClickedContinue ? 'active' : ''}`}></div>
                </div>
                <div className="progress-label">Step 3 of 3</div>
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
                We helped you land the job, now let's help you secure your visa.
              </div>

              {/* Question */}
              <div className="question-group">
                <p style={{ 
                  fontSize: '13.5px', 
                  color: 'var(--color-text-secondary)', 
                  letterSpacing: '-0.8px',
                  fontWeight: '600'
                }}>
                  Is your company providing an immigration lawyer to help with your visa?
                </p>
                
                {/* Radio Buttons */}
                <div className="space-y-3">
                  {['Yes', 'No'].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="companyLawyer"
                        value={option}
                        checked={companyProvidingLawyer === option}
                        onChange={() => handleOptionSelect(option as 'Yes' | 'No')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="font-['DM_Sans'] text-base text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>

                {/* Conditional Follow-up Content */}
                {companyProvidingLawyer === 'Yes' && (
                  <div className="question-group" style={{ marginTop: '10px' }}>
                    <p style={{ 
                      marginBottom: '0px', 
                      fontSize: '16px', 
                      color: 'black', 
                      letterSpacing: '-0.8px',
                      fontWeight: '400'
                    }}>
                      What visa will you be applying for?*
                    </p>
                    <input
                      type="text"
                      value={visaType}
                      onChange={(e) => handleVisaTypeChange(e.target.value)}
                      placeholder="Enter Visa Type"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['DM_Sans'] text-base text-gray-900 placeholder-gray-500"
                      style={{
                        fontFamily: 'var(--font-family-main)'
                      }}
                    />
                  </div>
                )}

                {companyProvidingLawyer === 'No' && (
                  <div className="question-group" style={{ marginTop: '10px' }}>
                    <p style={{ 
                      fontSize: '16px', 
                      color: 'black', 
                      letterSpacing: '-0.8px',
                      fontWeight: '400'
                    }}>
                      We can connect you with one of our trusted partners.<br />
                      Which visa would you like to apply for?*
                    </p>
                    <input
                      type="text"
                      value={visaType}
                      onChange={(e) => handleVisaTypeChange(e.target.value)}
                      placeholder="Enter visa type"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['DM_Sans'] text-base text-gray-900 placeholder-gray-500"
                      style={{
                        fontFamily: 'var(--font-family-main)'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Complete Cancellation Button */}
              <div className="action-buttons" style={{ marginTop: '20px' }}>
                <button
                  onClick={handleCompleteCancellation}
                  disabled={!isFormValid}
                  className={`btn ${isFormValid ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Complete cancellation
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