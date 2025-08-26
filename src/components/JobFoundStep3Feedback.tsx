'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface JobFoundStep3FeedbackProps {
  onBack: () => void;
  onClose: () => void;
  onContinue: (data: JobFoundStep3FeedbackData) => void;
}

interface JobFoundStep3FeedbackData {
  companyProvidingLawyer: 'Yes' | 'No' | null;
  visaType?: string;
}

export default function JobFoundStep3Feedback({
  onBack,
  onClose,
  onContinue
}: JobFoundStep3FeedbackProps) {
  const [companyProvidingLawyer, setCompanyProvidingLawyer] = useState<'Yes' | 'No' | null>(null);
  const [visaType, setVisaType] = useState<string>('');

  const handleContinue = () => {
    if (companyProvidingLawyer !== null) {
      if ((companyProvidingLawyer === 'Yes' || companyProvidingLawyer === 'No') && visaType.trim() === '') {
        // If they have selected either option but haven't entered visa type, don't proceed
        return;
      }
      
      const data: JobFoundStep3FeedbackData = {
        companyProvidingLawyer,
        ...((companyProvidingLawyer === 'Yes' || companyProvidingLawyer === 'No') && { visaType: visaType.trim() })
      };
      
      onContinue(data);
    }
  };

  const isFormValid = companyProvidingLawyer !== null && 
    ((companyProvidingLawyer === 'Yes' || companyProvidingLawyer === 'No') ? visaType.trim() !== '' : true);

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-75 z-50">
      {/* Main Modal Container */}
      <div 
        className="bg-white rounded-[20px] shadow-[0px_0px_20px_rgba(0,0,0,0.25)]"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '0px',
          position: 'absolute',
          width: '1008px',
          height: '440px',
          left: 'calc(50% - 1008px/2 - 4.21px)',
          top: 'calc(50% - 440px/2 - 3.48px)',
          background: '#FFFFFF',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
          borderRadius: '20px',
          transform: 'rotate(0.05deg)'
        }}
      >
        {/* Header Section */}
        <div 
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '18px 20px',
            gap: '10px',
            isolation: 'isolate',
            width: '100%',
            height: '60px',
            borderBottom: '1px solid #E6E6E6',
            transform: 'rotate(0.05deg)',
            flex: 'none',
            order: 0,
            flexGrow: 0,
            margin: '-3px 0px'
          }}
        >
          {/* Left side - Back button and title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <h1 className="font-['DM_Sans'] font-semibold text-base text-gray-800">
              Subscription Cancellation
            </h1>
          </div>

          {/* Center - Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-600">Step 3 of 3</span>
          </div>

          {/* Right side - Close button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            gap: '20px',
            width: '1008px',
            height: '373px',
            transform: 'rotate(0.05deg)',
            flex: 'none',
            order: 1,
            alignSelf: 'stretch',
            flexGrow: 0
          }}
        >
          {/* Left Content */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '20px',
              width: '548px',
              height: '333px',
              transform: 'rotate(0.05deg)',
              flex: 'none',
              order: 0,
              alignSelf: 'stretch',
              flexGrow: 1
            }}
          >
            {/* Main Heading */}
            <div className="w-full">
              <h2 className="font-['DM_Sans'] font-bold text-4xl text-gray-900 mb-2">
                You landed the job!
              </h2>
              <p className="font-['DM_Sans'] font-bold italic text-4xl text-gray-900 mb-6">
                That's what we live for.
              </p>
              <p className="font-['DM_Sans'] text-base text-gray-700 mb-6">
                Even if it wasn't through Migrate Mate, let us help get your visa sorted.
              </p>
            </div>

            {/* Visa Question */}
            <div className="w-full">
              <p className="font-['DM_Sans'] font-semibold text-base text-gray-900 mb-4">
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
                      onChange={() => setCompanyProvidingLawyer(option as 'Yes' | 'No')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-['DM_Sans'] text-base text-gray-900">{option}</span>
                  </label>
                ))}
              </div>

              {/* Conditional Follow-up Content */}
              {companyProvidingLawyer === 'Yes' && (
                <div className="mt-6">
                  <p className="font-['DM_Sans'] font-semibold text-base text-gray-900 mb-4">
                    What visa will you be applying for?*
                  </p>
                  <input
                    type="text"
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    placeholder="Enter visa type..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['DM_Sans'] text-base text-gray-900 placeholder-gray-500"
                  />
                </div>
              )}

              {companyProvidingLawyer === 'No' && (
                <div className="mt-6">
                  <p className="font-['DM_Sans'] text-base text-gray-600 mb-4">
                    We can connect you with one of our trusted partners.
                  </p>
                  <p className="font-['DM_Sans'] font-semibold text-base text-gray-900 mb-4">
                    Which visa would you like to apply for?*
                  </p>
                  <input
                    type="text"
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    placeholder="Enter visa type"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['DM_Sans'] text-base text-gray-900 placeholder-gray-500"
                  />
                </div>
              )}
            </div>

            {/* Complete Cancellation Button */}
            <div className="w-full mt-auto">
              <button
                onClick={handleContinue}
                disabled={!isFormValid}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isFormValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Complete cancellation
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div 
            className="relative"
            style={{
              width: '400px',
              height: '333px',
              boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.2), inset 0px -6px 4px rgba(0, 0, 0, 0.5)',
              borderRadius: '12px',
              transform: 'rotate(0.05deg)',
              padding: '20px'
            }}
          >
            <Image
              src="/empire-state-compressed.jpg"
              alt="New York City skyline with Empire State Building"
              fill
              className="object-cover rounded-[12px]"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
} 