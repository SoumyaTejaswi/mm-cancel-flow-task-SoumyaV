'use client';

import React, { useState } from 'react';
import JobQuestionModal from './JobQuestionModal';

export default function ModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleYesFoundJob = () => {
    console.log('User found a job');
    setIsModalOpen(false);
    // Add your logic here for when user found a job
  };

  const handleStillLooking = () => {
    console.log('User is still looking for a job');
    setIsModalOpen(false);
    // Add your logic here for when user is still looking
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Job Question Modal Demo
        </h1>
        <p className="text-gray-600 mb-8">
          Click the button below to open the modal
        </p>
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Open Job Question Modal
        </button>

        {/* Modal */}
        {isModalOpen && (
          <JobQuestionModal
            onClose={handleCloseModal}
            onYesFoundJob={handleYesFoundJob}
            onStillLooking={handleStillLooking}
          />
        )}
      </div>
    </div>
  );
} 