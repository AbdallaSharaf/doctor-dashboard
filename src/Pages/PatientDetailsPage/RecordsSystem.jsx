import React, { useState, useEffect, useRef } from 'react';
import AddRecordModal from '../../components/modals/RecordModal'; // Adjust the import path
import { formatDateTime } from '../../helpers/Helpers';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem'; // Import PaginationItem
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';

const RecordsSystem = ({ patientId, patientRecords }) => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(location.state?.openAddRecordModal || false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'case photos'
    const [selectedRecord, setSelectedRecord] = useState(patientRecords[patientRecords.length - 1]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false)
    const overviewRef = useRef(null); // Create a ref for the overview section
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0); // To track the index of the selected photo

    
    const handleAddRecordClick = (record) => {
        if (record) setIsEditing(true)
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsEditing(false)
    setIsModalOpen(false);
  };

  const handleViewRecord = (rec) => {
    setSelectedRecord(rec); // Set the selected record index
    setActiveTab('overview'); // Switch to the overview tab
    if (overviewRef.current) {
        overviewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  
    return () => document.body.classList.remove('overflow-hidden'); // Cleanup on component unmount
  }, [isModalOpen]);


  const renderCasePhotos = () => {
    // State to manage the selected image for the modal
  
    const totalPages = Math.ceil(
      patientRecords.filter((record) => record.casePhotos && record.casePhotos.length > 0).length / 5
    );
    const indexOfLastRecord = currentPage * 5;
    const indexOfFirstRecord = indexOfLastRecord - 5;
    
    // Filter the records to only include those with casePhotos
    const currentRecords = patientRecords
      .filter((record) => record.casePhotos && record.casePhotos.length > 0)
      .slice(indexOfFirstRecord, indexOfLastRecord);
  
   // Function to open the modal with the selected photo and set its index
   const handlePhotoClick = (photo, recordIndex, photoIndex) => {
    setSelectedPhoto(photo); // Set the clicked photo in state
    setSelectedPhotoIndex({ recordIndex, photoIndex }); // Set the clicked photo index
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedPhoto(null); // Reset the selected photo
    setSelectedPhotoIndex(null); // Reset the selected photo index
  };

  // Function to go to the next photo in the list
  const nextPhoto = () => {
    const { recordIndex, photoIndex } = selectedPhotoIndex;
    const nextPhotoIndex = photoIndex + 1;
    const nextRecord = currentRecords[recordIndex];
    if (nextPhotoIndex < nextRecord.casePhotos.length) {
      setSelectedPhoto(nextRecord.casePhotos[nextPhotoIndex]);
      setSelectedPhotoIndex({ recordIndex, photoIndex: nextPhotoIndex });
    }
    else if (recordIndex + 1 < currentRecords.length) {
        // Move to the next record
        const nextRecordIndex = recordIndex + 1;
        setSelectedPhoto(currentRecords[nextRecordIndex].casePhotos[0]);
        setSelectedPhotoIndex({ recordIndex: nextRecordIndex, photoIndex: 0 });
      }
  };

  // Function to go to the previous photo in the list
  const prevPhoto = () => {
    const { recordIndex, photoIndex } = selectedPhotoIndex;
    const prevPhotoIndex = photoIndex - 1;
    if (prevPhotoIndex >= 0) {
      setSelectedPhoto(currentRecords[recordIndex].casePhotos[prevPhotoIndex]);
      setSelectedPhotoIndex({ recordIndex, photoIndex: prevPhotoIndex });
    }
    else if (recordIndex > 0) {
        // Move to the previous record
        const prevRecordIndex = recordIndex - 1;
        const prevRecord = currentRecords[prevRecordIndex];
        setSelectedPhoto(prevRecord.casePhotos[prevRecord.casePhotos.length - 1]);
        setSelectedPhotoIndex({ recordIndex: prevRecordIndex, photoIndex: prevRecord.casePhotos.length - 1 });
      }
  };

    return (
      <>
        <div>
          {currentRecords.map((record, index) => {
            // Check if the record has case photos
            if (record.casePhotos && record.casePhotos.length > 0) {
              return (
                <div key={index} className="mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {new Date(record.dueDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </h3>
  
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                      {record.casePhotos.map((photo, photoIndex) => (
                        <img
                          key={photoIndex}
                          src={photo}
                          alt={`Case photo ${photoIndex + 1}`}
                          className="rounded-lg shadow-lg w-20 h-20 cursor-pointer"
                          onClick={() => handlePhotoClick(photo, index, photoIndex)} // Open the photo in modal
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return null; // If no photos in the record, return null
          })}
          <div className="mt-4 flex justify-end">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
            renderItem={(item) => (
                <PaginationItem
                {...item}
                classes={{
                    root: "text-primary-text dark:text-primary-text", // Default text color
                    selected: "bg-pagination-500-important dark: bg-pagination-500-dark-important", // Use the important class
                }}
                />
            )}
            />
          </div>
        </div>
  
        {/* Modal to display the selected photo */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal} // Close modal when clicked outside
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg max-w-fit w-full"
              onClick={(e) => e.stopPropagation()} // Prevent click event from closing the modal when clicking inside
            >
              <img
                src={selectedPhoto}
                alt="Selected case photo"
                className="max-w-full max-h-96 object-contain mx-auto"
              />
              <div className="flex justify-between mt-4">
                <button
                  className="opacity-30 hover:opacity-60 disabled:opacity-60 text-3xl"
                  onClick={prevPhoto} // Go to the previous photo
                  disabled={
                    selectedPhotoIndex.recordIndex === 0 &&
                    selectedPhotoIndex.photoIndex === 0
                } // Disable the button if it's the first photo
                >
                  <FontAwesomeIcon icon={faChevronCircleLeft}/>
                </button>
                <button
                  className="opacity-30 hover:opacity-60 disabled:opacity-60 text-3xl"
                  onClick={nextPhoto} // Go to the next photo
                  disabled={
                    selectedPhotoIndex && 
                    currentRecords.length === selectedPhotoIndex.recordIndex + 1 &&
                    currentRecords[selectedPhotoIndex.recordIndex].casePhotos.length ===
                      selectedPhotoIndex.photoIndex + 1
                  } // Disable if last photo in the record
                >
                    <FontAwesomeIcon icon={faChevronCircleRight}/>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  
  

// The renderOverview function with clickable records
const renderOverview = () => {  
    // Get the selected record, or default to the most recent record
    const record = selectedRecord
  
      const sortedRecords = patientRecords.filter((rec) => rec !== selectedRecord);
      sortedRecords.unshift(selectedRecord);


    const handlePhotoClick = (photo, photoIndex) => {
        setSelectedPhoto(photo); // Set the clicked photo in state
        setSelectedPhotoIndex( photoIndex ); // Set the clicked photo index
      };
    
      // Function to close the modal
      const closeModal = () => {
        setSelectedPhoto(null); // Reset the selected photo
        setSelectedPhotoIndex(null); // Reset the selected photo index
      };
    
      // Function to go to the next photo in the list
      const nextPhoto = () => {
        const nextPhotoIndex = selectedPhotoIndex + 1;
        if (nextPhotoIndex < record.casePhotos.length) {
          setSelectedPhoto(record.casePhotos[nextPhotoIndex]);
          setSelectedPhotoIndex(nextPhotoIndex);
        }
      };
    
      // Function to go to the previous photo in the list
      const prevPhoto = () => {
        const prevPhotoIndex = selectedPhotoIndex - 1;
        if (prevPhotoIndex >= 0) {
          setSelectedPhoto(record.casePhotos[prevPhotoIndex]);
          setSelectedPhotoIndex(prevPhotoIndex);
        }
      };
    
    if (!record) return <p>No records available</p>;
    return (
      <div ref={overviewRef} id="overview" className='scroll-mt-12'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='font-semibold text-xl'>{record.dueDate ? formatDateTime(record.dueDate) : 'Date not available'}</h1>
            <h2 className='text-sm opacity-70'>{record.doctorTreating || 'Doctor not assigned'}</h2>
          </div>
          <button onClick={() => handleAddRecordClick(record)} className="px-4 py-2 bg-blue-400 bg-opacity-20 text-blue-400 hover:text-secondary-text hover:bg-opacity-100 duration-200 transition-all ease-in-out font-medium text-xs w-fit rounded-md">
            Edit
          </button> 
        </div>
        {/* List of Records (Click to Change Record) */}
        <div className="flex gap-4 overflow-x-auto mb-10 scrollbar-hide">
          {sortedRecords.map((rec, index) => (
            <button 
              key={index} 
              onClick={() => {setSelectedRecord(rec);}}
              className={`px-5 py-4 text-sm rounded-full hover:bg-blue-500 hover:text-white duration-200 transition-all ease-in-out ${record === rec ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
            >
                {new Date(rec.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </button>
          ))}
        </div>
  
        {/* Render selected record details */}
        <div>
          {/* Record Fields with Fallback Messages */}
          <div className='w-full justify-between grid md:grid-cols-2 grid-cols-1 items-center mb-5'>
            <div>
              <div className='border-l-4 mb-5 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 py-1'>
                <h1 className='font-medium'>Date</h1>
                <p className='text-sm font-thin'>{record.dueDate ? formatDateTime(record.dueDate) : 'Not available'}</p>
              </div>
              <div className='border-l-4 mb-5 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 py-1'>
                <h1 className='font-medium'>Doctor Treating</h1>
                <p className='text-sm font-thin'>{record.doctorTreating || 'Not assigned'}</p>
              </div>
              <div className='border-l-4 mb-5 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 py-1'>
                <h1 className='font-medium'>Next Appointment</h1>
                <p className='font-thin text-sm'>{formatDateTime(record.nextAppointmentDate)}</p>
              </div>
            </div>
            <div>
              <div className='md:border-r-4 md:border-l-0 border-l-4 mb-5 md:text-right pl-3 md:pr-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 py-1'>
                <h1 className='font-medium'>Diagnoses</h1>
                <p className='font-thin text-sm'>{record.diagnoses?.length ? record.diagnoses.join(', ') : 'No diagnoses available'}</p>
              </div>
              <div className='md:border-r-4 md:border-l-0 border-l-4 mb-5 md:text-right pl-3 md:pr-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 py-1'>
                <h1 className='font-medium'>Jobs Done</h1>
                <p className='font-thin text-sm'>{record.jobs?.length ? record.jobs.join(', ') : 'No jobs recorded'}</p>
              </div>
              <div className='md:border-r-4 md:border-l-0 border-l-4 md:mb-5 md:text-right pl-3 md:pr-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 py-1'>
                <h1 className='font-medium'>Medicines</h1>
                <p className='font-thin text-sm'>{record.medicines?.length ? record.medicines.join(', ') : 'No medicines prescribed'}</p>
              </div>
            </div>
          </div>
          
          <div className='border-l-4 pl-3 flex flex-col justify-evenly border-gray-500 border-opacity-15 mb-5 py-1'>
            <h1 className='font-medium mb-1'>Case Photos</h1>
            <div className='flex flex-wrap gap-2'>
              {record.casePhotos?.length ? (
                record.casePhotos.map((photo, photoIndex ) => (
                  <img
                    key={photo}
                    src={photo}
                    alt={`Preview`}
                    className="h-20 w-20 object-cover rounded-md"
                    onClick={() => handlePhotoClick(photo, photoIndex)} // Open the photo in modal
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
  
          <div className='w-full mb-5 py-1'>
            <div className='px-4 py-2 flex ml-auto w-fit'>
              <h1 className='font-semibold pr-2'>Total Due:</h1>
              <p className='font-thin'>{record.price ? `${record.price.paid + record.price.remaining} EGP` : 'Price not set'}</p>
            </div>
          </div>
        </div>
         {/* Modal to display the selected photo */}
         {selectedPhoto && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal} // Close modal when clicked outside
          >
            <div
              className="bg-white dark:bg-table-container-bg p-6 rounded-lg shadow-lg max-w-fit w-full"
              onClick={(e) => e.stopPropagation()} // Prevent click event from closing the modal when clicking inside
            >
              <img
                src={selectedPhoto}
                alt="Selected case photo"
                className="max-w-full max-h-96 object-contain mx-auto"
              />
              <div className="flex justify-between mt-4">
                <button
                  className="opacity-60 md:opacity-30 hover:opacity-60 disabled:md:opacity-60 disabled:opacity-30 text-3xl"
                  onClick={prevPhoto} // Go to the previous photo
                  disabled={
                    selectedPhotoIndex === 0
                } // Disable the button if it's the first photo
                >
                  <FontAwesomeIcon icon={faChevronCircleLeft}/>
                </button>
                <button
                  className="opacity-60 md:opacity-30 hover:opacity-60 disabled:md:opacity-60 disabled:opacity-30 text-3xl"
                  onClick={nextPhoto} // Go to the next photo
                  disabled={
                    selectedPhotoIndex && 
                    record.casePhotos.length ===
                      selectedPhotoIndex + 1
                  } // Disable if last photo in the record
                >
                    <FontAwesomeIcon icon={faChevronCircleRight}/>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  
  const renderAllRecords = () => {
    const totalPages = Math.ceil(patientRecords.length / 10);
    const indexOfLastRecord = currentPage * 10;
    const indexOfFirstRecord = indexOfLastRecord - 10;
    const currentRecords = patientRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    return (
      <div>
        <div className='mb-3'>
            <h1 className='font-semibold text-xl'>Patient Records</h1>
            <h2 className='text-sm opacity-70'>{`Total of ${patientRecords.length} records`}</h2>
        </div>
        <>
        <table className="table-auto w-full hidden md:table">
          <thead>
            <tr className="font-medium h-14">
              <th className="text-sm pl-4">NO</th>
              <th className="text-sm pl-4">Date</th>
              <th className="text-sm">Doctor</th>
              <th className="text-sm">Payment</th>
              <th className=""></th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                <td className="pl-4 py-3 text-sm text-center">{index + 1 + (currentPage - 1) * 5}</td>
                <td className="py-3 text-sm text-center pl-4">{formatDateTime(record.dueDate)}</td>
                <td className="py-3 text-sm text-center">{record.doctorTreating}</td>
                <td className="text-sm text-center p-2 flex justify-center text-white gap-2">
                    <p className='px-2 py-1 bg-green-400 rounded-md'>{Math.floor(record.price.paid)}</p>
                    <p className='px-2 py-1 bg-red-400 rounded-md'>{Math.floor(record.price.remaining)}</p>
                </td>
                <td className="py-3 text-sm text-center">
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
        <div className='flex flex-col justify-between items-center md:hidden'>
                {currentRecords.map((record, id) => (
                    <div className={`${id % 2 ===0 ? 'bg-even-row-bg':''} flex justify-between items-center w-full px-3 py-2`} key={id}>
                    <div className='flex justify-between items-center w-full'>
                        <div >
                        <p className='font-medium'>{record.doctorTreating}</p>
                        <p className='text-sm font-light'>{formatDateTime(record.dueDate)}</p>
                        </div>
                        <button
                          onClick={() => handleViewRecord(index)}
                          className="px-4 py-2 bg-blue-400 bg-opacity-20 text-blue-400 hover:text-secondary-text hover:bg-opacity-100 duration-200 transition-all ease-in-out font-medium text-xs w-fit rounded-md"
                        >
                          view
                        </button>
                    </div>
                    </div>
                ))}
            </div>
        </>
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
  
  return (
    <div className={`mt-4`}>
      <div className='flex items-center justify-between'>
        <div className='flex justify-center md:gap-5 md:text-base gap-2 mt-2'>
            <div className='group'>
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-all  duration-300 ease-in-out ${
                activeTab === 'overview' ? 'text-blue-500 ' : 'group-hover:text-blue-500'
              }`}>
            Overview
          </button>
          <div
                    className={`md:mt-2 ${
                        activeTab === 'overview' ? 'bg-blue-500 h-[2px] overflow-hidden transition-all duration-500 ease-in-out w-full' : 'bg-blue-500 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-in-out'
                      }`}
                  />
          </div>
          <div className='group'>
          <button
            onClick={() => setActiveTab('records')}
            className={`transition-all  duration-300 ease-in-out ${
                activeTab === 'records' ? 'text-blue-500 ' : 'group-hover:text-blue-500'
              }`}>
            Records
          </button>
          <div
                    className={`md:mt-2 ${
                        activeTab === 'records' ? 'bg-blue-500 h-[2px] overflow-hidden transition-all duration-500 ease-in-out w-full' : 'bg-blue-500 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-in-out'
                      }`}
                  />
          </div>
          <div className='group'>
          <button
            onClick={() => setActiveTab('case photos')}
            className={`transition-all duration-300 ease-in-out ${
                activeTab === 'case photos' ? 'text-blue-500 ' : 'group-hover:text-blue-500'
              }`}>
            Case Photos
          </button>
          <div
                    className={`md:mt-2 ${
                      activeTab === 'case photos' ? 'bg-blue-500 h-[2px] overflow-hidden transition-all duration-500 ease-in-out w-full' : 'bg-blue-500 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-in-out'
                    }`}
                  />
          </div>
        </div>
        <button
          onClick={() => handleAddRecordClick()}
          className='w-fit text-secondary-text text-sm md:text-base rounded-md px-4 py-2 bg-primary-btn hover:bg-hover-btn transition-all duration-200 ease-in-out'>
          Add Record
        </button>
      </div>
      <div className='bg-table-container-bg py-8 px-9 md:mt-6 mt-4 w-full rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.02)] border border-gray-200 dark:border-transparent'>
      {
        activeTab === 'overview' ? renderOverview() :
        activeTab === 'case photos' ? renderCasePhotos() :
        activeTab === 'records' ? renderAllRecords() :
        null
      }
      </div>
      <AddRecordModal isOpen={isModalOpen} onClose={handleCloseModal} patientId={patientId} record={isEditing ? selectedRecord : null}/>
    </div>
  );
};

export default RecordsSystem;
