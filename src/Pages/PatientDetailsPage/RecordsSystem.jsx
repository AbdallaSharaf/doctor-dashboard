import React, { useState } from 'react';
import AddRecordModal from '../../components/modals/AddRecordModal'; // Adjust the import path
import { formatDateTime } from '../../helpers/Helpers';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem'; // Import PaginationItem

const RecordsSystem = ({ patientId, patientRecords }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'events'
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(patientRecords.length - 1); // Track the selected record index
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false)

  const handleAddRecordClick = (record) => {
    if (record) setIsEditing(true)
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsEditing(false)
    setIsModalOpen(false);
  };

  const handleViewRecord = (index) => {
    setSelectedRecordIndex(index); // Set the selected record index
    console.log(selectedRecordIndex)
    setActiveTab('overview'); // Switch to the overview tab
  };

  const renderOverview = () => {
    const record = selectedRecordIndex !== null ? patientRecords[selectedRecordIndex] : patientRecords[patientRecords.length - 1]; 
    if (!record) return <p>No records available</p>;
    const dueDate = new Date(record.dueDate);
    
    // Create an array of dates for the slider
    const dateArray = [];
    for (let i = -1; i <= 9; i++) {
      const date = new Date(dueDate);
      date.setDate(dueDate.getDate() + i);
      dateArray.push(date);
    }
  
    return (
      <div>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='font-semibold text-xl'>{record.dueDate ? formatDateTime(record.dueDate) : 'Date not available'}</h1>
            <h2 className='text-sm'>{record.doctorTreating || 'Doctor not assigned'}</h2>
          </div>
          <button onClick={() => handleAddRecordClick(record)} className="px-4 py-2 bg-blue-400 bg-opacity-20 text-blue-400 hover:text-secondary-text hover:bg-opacity-100 duration-200 transition-all ease-in-out font-medium text-xs w-fit rounded-md">
            Edit
          </button> 
        </div>
  
        {/* Date Slider */}
        <div className='overflow-x-auto flex space-x-4 py-4 date-slider mb-10'>
          {dateArray.map((date, index) => {
            const day = date.toLocaleString('en-US', { weekday: 'short' });
            const dayOfMonth = date.getDate();
            return (
              <div
                key={index}
                className={`flex flex-col items-center rounded-full py-3 min-w-14 ${
                  date.toISOString().split('T')[0] === record.dueDate?.split('T')[0] || date.toISOString().split('T')[0] === record.nextAppointmentDate ? 'bg-blue-500' : ''
                }`}>
                <span className={`text-xs pb-[2px] ${
                  date.toISOString().split('T')[0] === record.dueDate?.split('T')[0] || date.toISOString().split('T')[0] === record.nextAppointmentDate ? 'text-white text-opacity-50 ' : ' text-blue-500 text-opacity-50'
                }`}>{day}</span>
                <span className={`text-sm font-medium ${
                  date.toISOString().split('T')[0] === record.dueDate?.split('T')[0] || date.toISOString().split('T')[0] === record.nextAppointmentDate ? 'text-white' : ' text-blue-500'
                }`}>{dayOfMonth}</span>
              </div>
            );
          })}
        </div>
  
        {/* Record Fields with Fallback Messages */}
        <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
          <h1 className='font-medium'>Date</h1>
          <p className='text-sm font-thin'>{record.dueDate ? formatDateTime(record.dueDate) : 'Not available'}</p>
        </div>
        <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
          <h1 className='font-medium'>Doctor Treating</h1>
          <p className='text-sm font-thin'>{record.doctorTreating || 'Not assigned'}</p>
        </div>
        <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
          <h1 className='font-medium'>Jobs Done</h1>
          <p className='font-thin text-sm'>{record.jobs?.length ? record.jobs.join(', ') : 'No jobs recorded'}</p>
        </div>
        <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
          <h1 className='font-medium'>Diagnoses</h1>
          <p className='font-thin text-sm'>{record.diagnoses?.length ? record.diagnoses.join(', ') : 'No diagnoses available'}</p>
        </div>
        <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
          <h1 className='font-medium'>Medicines</h1>
          <p className='font-thin text-sm'>{record.medicines?.length ? record.medicines.join(', ') : 'No medicines prescribed'}</p>
        </div>
        <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
          <h1 className='font-medium'>Next Appointment</h1>
          <p className='font-thin text-sm'>{formatDateTime(record.nextAppointmentDate)}</p>
        </div>
        <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
          <h1 className='font-medium mb-1'>Case Photos</h1>
          <div className='flex gap-2'>
            {record.casePhotos?.length ? (
              record.casePhotos.map(img => (
                <img
                  key={img}
                  src={img}
                  alt={`Preview`}
                  className="h-20 w-20 object-cover rounded-md"
                />
              ))
            ) : (
              <p className='text-sm font-thin'>No photos uploaded</p>
            )}
          </div>
        </div>
        <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
          <h1 className='font-medium'>Additional Notes</h1>
          <p className='font-thin text-sm'>{record.additionalNotes || 'No notes provided'}</p>
        </div>
        <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
          <h1 className='font-medium'>Price</h1>
          <p className='font-thin text-sm'>{record.price ? `${record.price} $` : 'Price not set'}</p>
        </div>
      </div>
    );
  };
  
  

  const renderEvents = () => {
    const totalPages = Math.ceil(patientRecords.length / 10);
    const indexOfLastRecord = currentPage * 10;
    const indexOfFirstRecord = indexOfLastRecord - 10;
    const currentRecords = patientRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    
    return (
      <div>
        <table className="table-auto w-full">
          <thead>
            <tr className="font-medium h-14">
              <th className="w-1/12 text-left pl-4">NO</th>
              <th className="w-4/12 text-left pl-4">Date</th>
              <th className="w-5/12 text-left">Doctor</th>
              <th className="w-2/12"></th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                <td className="pl-4 py-3">{index + 1}</td>
                <td className="py-3 pl-4">{formatDateTime(record.dueDate)}</td>
                <td className="py-3">{record.doctorTreating}</td>
                <td className="py-3">
                  <button
                    onClick={() => handleViewRecord(index)}
                    className="px-4 py-2 bg-blue-400 bg-opacity-20 text-blue-400 hover:text-secondary-text hover:bg-opacity-100 duration-200 transition-all ease-in-out font-medium text-xs w-fit rounded-md"
                  >
                    view
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                shape="rounded"
                color="#1B84FF"
                siblingCount={1} // Show one sibling on each side of the current page
                boundaryCount={1} 
                renderItem={(item) => (
                    <PaginationItem {...item} />
                )}
            />
            </div>
      </div>
    );
  };
  
  console.log(patientRecords[selectedRecordIndex])
  return (
    <div className=' mt-4'>
      <div className='flex items-center justify-between'>
        <div className='flex justify-center gap-5'>
            <div className='group'>
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-all  duration-300 ease-in-out ${
                activeTab === 'overview' ? 'text-blue-500 ' : 'group-hover:text-blue-500'
              }`}>
            Overview
          </button>
          <div
                    className={`mt-2 ${
                        activeTab === 'overview' ? 'bg-blue-500 h-[2px] overflow-hidden transition-all duration-500 ease-in-out w-full' : 'bg-blue-500 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-in-out'
                      }`}
                  />
          </div>
          <div className='group'>
          <button
            onClick={() => setActiveTab('events')}
            className={`transition-all duration-300 ease-in-out ${
                activeTab === 'events' ? 'text-blue-500 ' : 'group-hover:text-blue-500'
              }`}>
            Events
          </button>
          <div
                    className={`mt-2 ${
                      activeTab === 'events' ? 'bg-blue-500 h-[2px] overflow-hidden transition-all duration-500 ease-in-out w-full' : 'bg-blue-500 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-in-out'
                    }`}
                  />
          </div>
        </div>
        <button
          onClick={handleAddRecordClick}
          className='w-fit text-secondary-text rounded-md px-4 py-2 bg-primary-btn hover:bg-hover-btn transition-all duration-200 ease-in-out'>
          Add Record
        </button>
      </div>
      <div className='bg-white py-8 px-9 mt-6 w-full rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.02)] border border-gray-200'>
        {activeTab === 'overview' ? renderOverview() : renderEvents()}
      </div>
      <AddRecordModal isOpen={isModalOpen} onClose={handleCloseModal} patientId={patientId} record={isEditing && patientRecords[selectedRecordIndex]}/>
    </div>
  );
};

export default RecordsSystem;
