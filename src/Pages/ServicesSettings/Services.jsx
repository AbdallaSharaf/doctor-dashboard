import React, { useEffect, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Service from './Service';
import ServicesModal from '../../components/modals/ServicesModal';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { deleteService, reorderServices, saveServiceOrder } from '../../store/slices/servicesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../components/Spinner'; // Import Spinner


const ServicesPage = () => {
  const [timeoutId, setTimeoutId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services.list);
  const loading  = useSelector((state) => state.services.loading);
  
  
  //--------------------------handlers-------------------------------
  
  // Handle input changes for the new service form
  const handleInputChange = (e, serviceSetter) => {
    const { name, value } = e.target;
    serviceSetter(prev => ({ ...prev, [name]: value }));
  };
  

  
  
  // Delete a services service
  const handleDeleteService = async (id) => {
    const serviceToDelete = services.find(service => service.id === id);
    const result = await Swal.fire({
        title: `Are you sure you want to delete ${serviceToDelete.name}?`,
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      });
  
    if (result.isConfirmed) {
      await dispatch(deleteService({id}));
      Swal.fire('Deleted!', `${serviceToDelete.name} has been deleted.`, 'success');
    }
  };
  
  
  // Move service in the list (reordering)
  const handleMoveService = useCallback(async (dragIndex, hoverIndex) => {
    await dispatch(reorderServices({ dragIndex, hoverIndex }));
      if (timeoutId) {
      clearTimeout(timeoutId);
    }
  
    // Set a new timeout to save changes after 2 minutes
    const id = setTimeout(async () => {
      await dispatch(saveServiceOrder({services})); // Dispatch the thunk to save order
    }, 120000); // 2 minutes
  
    setTimeoutId(id);
  }, [dispatch, timeoutId, services]);
  
  //------------------------------end of handlers-----------------------------
  
  //------------------------------effects-------------------------------------
  
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      await dispatch(saveServiceOrder({services})); // Dispatch the thunk to save order
      e.returnValue = '';
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup function
    return async () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(timeoutId); // Clear timeout on unmount
      await dispatch(saveServiceOrder({services})); // Dispatch the thunk to save order
    };
  }, [timeoutId, services, dispatch]);
  //--------------------------end 0f effects---------------------------------

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-6">
        <div className='flex justify-between mb-10'>
          <h2 className="text-lg font-semibold">Services Management</h2>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="mb-2 py-2 px-4 bg-primary-btn hover:bg-hover-btn w-[170px] text-white rounded">
              Add Service
          </button>
        </div>
        
        {/* Modal for adding new services service */}
        <ServicesModal 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
        />
        
        {loading ? ( // Conditional rendering for loading spinner
          <Spinner /> // Use Spinner component
        ) : (
          <div className='p-8 rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.04)] border border-gray-200'>
            {/* Grid Header */}
            <table className="w-full table-auto">
              <thead className='border-b-[16px] border-white'>
                <tr className="text-primary-text bg-gray-100 h-10">
                  <th className="text-center font-semibold py-2">
                    <FontAwesomeIcon icon={faBars} className="mr-3 text-gray-400 hidden" />
                  </th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm pr-6">NO</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Icon</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Name</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Short Description</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Long Description</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Show</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service, index) => (
                  <Service 
                    key={service.id} 
                    service={service} 
                    index={index} 
                    moveService={handleMoveService} 
                    handleInputChange={handleInputChange}
                    isModalOpen={isModalOpen} 
                    setIsModalOpen={setIsModalOpen} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default ServicesPage;
