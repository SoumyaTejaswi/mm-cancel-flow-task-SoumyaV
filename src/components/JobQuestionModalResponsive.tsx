'use client';

import React from 'react';
import Image from 'next/image';

interface JobQuestionModalProps {
  onClose: () => void;
  onYesFoundJob: () => void;
  onStillLooking: () => void;
}

export default function JobQuestionModalResponsive({
  onClose,
  onYesFoundJob,
  onStillLooking
}: JobQuestionModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-75 z-50">
      {/* Main Modal Container - Frame 4 */}
      <div 
        className="bg-white rounded-[20px] shadow-[0px_0px_20px_rgba(0,0,0,0.25)] overflow-hidden"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '0px',
          position: 'absolute',
          width: 'min(1008px, 95vw)',
          height: 'min(440px, 90vh)',
          left: 'calc(50% - min(1008px, 95vw)/2 - 4.21px)',
          top: 'calc(50% - min(440px, 90vh)/2 - 3.48px)',
          background: '#FFFFFF',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
          borderRadius: '20px',
          transform: 'rotate(0.05deg)'
        }}
      >
        {/* Header Section - Frame 34 */}
        <div 
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '18px 0px',
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
          {/* Subscription Cancellation Title */}
          <h1 
            className="font-['DM_Sans'] font-normal font-semibold text-base leading-[21px] flex items-center text-center"
            style={{
              width: '100%',
              height: '60px',
              color: '#41403D',
              transform: 'rotate(0.05deg)'
            }}
          >
            Subscription Cancellation
          </h1>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4"
            style={{
              width: '24px',
              height: '24px',
              transform: 'rotate(0.05deg)',
              zIndex: 1
            }}
            aria-label="Close modal"
          >
            <div 
              className="absolute"
              style={{
                left: '25.24%',
                right: '25.18%',
                top: '25.23%',
                bottom: '25.19%',
                background: '#62605C',
                transform: 'rotate(0.05deg)'
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="#62605C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Content Section - Frame 60 */}
        <div 
          className="lg:flex-row flex-col"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            gap: '20px',
            width: '100%',
            height: 'calc(100% - 60px)',
            transform: 'rotate(0.05deg)',
            flex: 'none',
            order: 1,
            alignSelf: 'stretch',
            flexGrow: 0
          }}
        >
          {/* Left Content - Frame 6 */}
          <div 
            className="w-full lg:w-auto"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '20px',
              width: 'min(548px, 100%)',
              height: 'auto',
              transform: 'rotate(0.05deg)',
              flex: 'none',
              order: 0,
              alignSelf: 'stretch',
              flexGrow: 1
            }}
          >
            {/* Text Content - Frame 35 */}
            <div 
              className="flex flex-col items-start w-full"
              style={{
                padding: '0px',
                gap: '16px',
                width: '100%',
                height: 'auto',
                transform: 'rotate(0.05deg)'
              }}
            >
              {/* Headline */}
              <h1 
                className="font-['DM_Sans'] font-normal font-semibold leading-[36px] w-full"
                style={{
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  letterSpacing: '-0.03em',
                  color: '#41403D',
                  transform: 'rotate(0.05deg)'
                }}
              >
                Hey mate, Quick one before you go.
              </h1>
              
              {/* Subheadline */}
              <h2 
                className="font-['DM_Sans'] font-italic font-semibold leading-[47px] w-full"
                style={{
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  letterSpacing: '-0.03em',
                  color: '#41403D',
                  transform: 'rotate(0.05deg)'
                }}
              >
                Have you found a job yet?
              </h2>
            </div>

            {/* Supporting Text */}
            <p 
              className="font-['DM_Sans'] font-normal font-semibold leading-[21px] w-full"
              style={{
                fontSize: 'clamp(14px, 2vw, 16px)',
                letterSpacing: '-0.05em',
                color: '#62605C',
                transform: 'rotate(0.05deg)'
              }}
            >
              Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we can do better.
            </p>

            {/* Divider */}
            <div 
              className="border border-[#E6E6E6] w-full"
              style={{
                height: '0px',
                transform: 'rotate(0.05deg)'
              }}
            />

            {/* Buttons Container - Frame 34 */}
            <div 
              className="flex flex-col justify-end items-center w-full"
              style={{
                padding: '0px',
                gap: '16px',
                width: '100%',
                height: 'auto',
                transform: 'rotate(0.05deg)'
              }}
            >
              {/* First Button */}
              <button
                onClick={onYesFoundJob}
                className="flex flex-row justify-center items-center border-2 border-[#E6E6E6] rounded-lg w-full"
                style={{
                  padding: '12px 24px',
                  gap: '10px',
                  height: '40px',
                  transform: 'rotate(0.05deg)'
                }}
              >
                <span 
                  className="font-['DM_Sans'] font-normal font-semibold text-base leading-[100%] flex items-center text-center"
                  style={{
                    letterSpacing: '-0.02em',
                    color: '#62605C',
                    transform: 'rotate(0.05deg)'
                  }}
                >
                  Yes, I've found a job
                </span>
              </button>

              {/* Second Button */}
              <button
                onClick={onStillLooking}
                className="flex flex-row justify-center items-center border-2 border-[#E6E6E6] rounded-lg w-full"
                style={{
                  padding: '12px',
                  gap: '10px',
                  height: '40px',
                  transform: 'rotate(0.05deg)'
                }}
              >
                <span 
                  className="font-['DM_Sans'] font-normal font-semibold text-base leading-[100%] flex items-center text-center"
                  style={{
                    letterSpacing: '-0.02em',
                    color: '#62605C',
                    transform: 'rotate(0.05deg)'
                  }}
                >
                  Not yet - I'm still looking
                </span>
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div 
            className="relative w-full lg:w-auto"
            style={{
              width: 'min(400px, 100%)',
              height: 'min(333px, 40vh)',
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