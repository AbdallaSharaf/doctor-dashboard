// RecordsSystem.js
import React, { useState } from 'react';
import AddRecordModal from '../../components/modals/AddRecordModal'; // Adjust the import path

const RecordsSystem = ({patientId, patientRecords }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRecordClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    
    setIsModalOpen(false);
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='flex justify-center gap-5'>
        <p>overview</p>
        <p>events</p>
        <p>blablabla</p>
      </div>
      <button
        onClick={handleAddRecordClick}
        className='w-fit text-secondary-text rounded-md px-4 py-2 bg-primary-btn hover:bg-hover-btn transition-all duration-200 ease-in-out'>
        add record
      </button>
      <AddRecordModal isOpen={isModalOpen} onClose={handleCloseModal} patientId={patientId} />
    </div>
  );
};

export default RecordsSystem;
