'use client';

import React from 'react';
import Image from 'next/image';

interface JobQuestionModalProps {
  onClose: () => void;
  onYesFoundJob: (data: any) => void;
  onStillLooking: () => void;
}

export default function JobQuestionModal({
  onClose,
  onYesFoundJob,
  onStillLooking
}: JobQuestionModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-75 z-50">
      {/* Main Modal Container - Frame 4 */}
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
            width: '1000px',
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
            className="absolute"
            style={{
              width: '24px',
              height: '24px',
              left: '956.02px',
              top: '18.91px',
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
          {/* Left Content - Frame 6 */}
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
            {/* Text Content - Frame 35 */}
            <div 
              className="flex flex-col items-start"
              style={{
                padding: '0px',
                gap: '16px',
                width: '548px',
                height: '135px',
                transform: 'rotate(0.05deg)'
              }}
            >
              {/* Headline */}
              <h1 
                className="font-['DM_Sans'] font-normal font-semibold leading-[36px]"
                style={{
                  width: '548px',
                  height: '72px',
                  fontSize: '36px',
                  letterSpacing: '-0.03em',
                  color: '#41403D',
                  transform: 'rotate(0.05deg)'
                }}
              >
                Hey mate, Quick one before you go.
              </h1>
              
              {/* Subheadline */}
              <h2 
                className="font-['DM_Sans'] font-italic font-semibold leading-[47px]"
                style={{
                  width: '548px',
                  height: '47px',
                  fontSize: '36px',
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
              className="font-['DM_Sans'] font-normal font-semibold leading-[21px]"
              style={{
                width: '469px',
                height: '42px',
                fontSize: '16px',
                letterSpacing: '-0.05em',
                color: '#62605C',
                transform: 'rotate(0.05deg)'
              }}
            >
              Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we can do better.
            </p>

            {/* Divider */}
            <div 
              className="border border-[#E6E6E6]"
              style={{
                width: '548px',
                height: '0px',
                transform: 'rotate(0.05deg)'
              }}
            />

            {/* Buttons Container - Frame 34 */}
            <div 
              className="flex flex-col justify-end items-center"
              style={{
                padding: '0px',
                gap: '16px',
                width: '548px',
                height: '96px',
                transform: 'rotate(0.05deg)'
              }}
            >
              {/* First Button */}
              <button
                onClick={() => onYesFoundJob({ hasFoundJob: true })}
                className="flex flex-row justify-center items-center border-2 border-[#E6E6E6] rounded-lg"
                style={{
                  padding: '12px 24px',
                  gap: '10px',
                  width: '548px',
                  height: '40px',
                  transform: 'rotate(0.05deg)'
                }}
              >
                <span 
                  className="font-['DM_Sans'] font-normal font-semibold text-base leading-[100%] flex items-center text-center"
                  style={{
                    width: '143px',
                    height: '16px',
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
                className="flex flex-row justify-center items-center border-2 border-[#E6E6E6] rounded-lg"
                style={{
                  padding: '12px',
                  gap: '10px',
                  width: '548px',
                  height: '40px',
                  transform: 'rotate(0.05deg)'
                }}
              >
                <span 
                  className="font-['DM_Sans'] font-normal font-semibold text-base leading-[100%] flex items-center text-center"
                  style={{
                    width: '179px',
                    height: '16px',
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