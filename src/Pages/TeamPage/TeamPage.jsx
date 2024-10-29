import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../helpers/Axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TeamMember from './TeamMember';
import TeamModal from '../../components/modals/TeamModal';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { addTeamMember, editTeamMember, deleteTeamMember, reorderTeamMembers, saveMemberOrder } from '../../store/slices/teamSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../components/Spinner'; // Import Spinner


const TeamPage = () => {
  const [editMember, setEditMember] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const dispatch = useDispatch();
  const { members, loading } = useSelector((state) => state.team);
  
  
  //--------------------------handlers-------------------------------
  
  // Handle input changes for the new member form
  const handleInputChange = (e, memberSetter) => {
    const { name, value } = e.target;
    memberSetter(prev => ({ ...prev, [name]: value }));
  };
  
  // Add a new team member
  const handleAddMember = async (newMember) => {
    if (!newMember.name || !newMember.job || !newMember.description || !newMember.image) {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'All fields are required before adding a new team member.',
          confirmButtonText: 'OK',
      });
      return; 
  }
  await dispatch(addTeamMember(newMember));
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: `${newMember.name} has been successfully added to the team.`,
    confirmButtonText: 'OK',
  });
};



  // Edit a team member
  const handleEditMember = async () => {
    await dispatch(editTeamMember(editMember))
    setEditMember(null);
  };
  
  
  // Delete a team member
  const handleDeleteMember = async (id) => {
    const memberToDelete = members.find(member => member.id === id);
    const result = await Swal.fire({
        title: `Are you sure you want to delete ${memberToDelete.name}?`,
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      });
  
    if (result.isConfirmed) {
      await dispatch(deleteTeamMember(id));
      Swal.fire('Deleted!', `${memberToDelete.name} has been deleted.`, 'success');
    }
  };
  
  
  // Move member in the list (reordering)
  const handleMoveMember = useCallback(async (dragIndex, hoverIndex) => {
    await dispatch(reorderTeamMembers({ dragIndex, hoverIndex }));
      if (timeoutId) {
      clearTimeout(timeoutId);
    }
  
    // Set a new timeout to save changes after 2 minutes
    const id = setTimeout(async () => {
      await dispatch(saveMemberOrder(members)); // Dispatch the thunk to save order
    }, 120000); // 2 minutes
  
    setTimeoutId(id);
  }, [dispatch, timeoutId, members]);
  
  //------------------------------end of handlers-----------------------------
  
  //------------------------------effects-------------------------------------
  
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      await dispatch(saveMemberOrder(members)); // Dispatch the thunk to save order
      e.returnValue = '';
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup function
    return async () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(timeoutId); // Clear timeout on unmount
      await dispatch(saveMemberOrder(members)); // Dispatch the thunk to save order
    };
  }, [timeoutId, members, dispatch]);
  //--------------------------end 0f effects---------------------------------

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-6">
        <div className='flex justify-between mb-10'>
          <h2 className="text-lg font-semibold">Team Management</h2>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="mb-2 py-2 px-4 bg-primary-btn hover:bg-hover-btn w-[170px] text-white rounded">
              Add Member
          </button>
        </div>
        
        {/* Modal for adding new team member */}
        <TeamModal 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          handleAddMember={handleAddMember} 
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
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Image</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Name</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Job</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Description</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Show</th>
                  <th className="text-center font-semibold py-2 text-primary-text text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member, index) => (
                  <TeamMember 
                    key={member.id} 
                    member={member} 
                    index={index} 
                    moveMember={handleMoveMember} 
                    setEditMember={setEditMember} 
                    handleDeleteMember={handleDeleteMember} 
                    editMember={editMember} 
                    handleEditMember={handleEditMember}
                    handleInputChange={handleInputChange}
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

export default TeamPage;
