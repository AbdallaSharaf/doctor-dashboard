import React, { useEffect, useState, useCallback } from 'react';
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
import Lottie from 'lottie-react';
import noDataAnimation from '../../assets/Animation - 1730816811189.json'
import { TeamMobileViewModal } from '../../components/modals/TeamMobileViewModal';

const TeamPage = () => {
  const [editMember, setEditMember] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const dispatch = useDispatch();
  const { members, loading } = useSelector((state) => state.team);
  const [mobileViewMember, setMobileViewMember] = useState(null);
  const [isMobileViewModalOpen, setIsMobileViewModalOpen] = useState(false); // State to manage modal visibility
  const openMobileViewModal = (member) => {
    setMobileViewMember(member)
    setIsMobileViewModalOpen(true);
};
const closeMobileViewModal = () => {
  setMobileViewMember(null)
  setIsMobileViewModalOpen(false);
};

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
      <div className="w-full p-7">
        <div className='flex justify-between items-center mb-6'>
          <h2 className="text-lg font-semibold">Team Management</h2>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="py-2 px-4 bg-primary-btn hover:bg-hover-btn text-white rounded flex items-center justify-center 
                        w-[170px]">
              Add Member
          </button>
        </div>
        
        {/* Modal for adding new team member */}
        <TeamModal 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          handleAddMember={handleAddMember} 
        />
        
          <div className='bg-table-container-bg p-4 md:p-7 rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.04)] dark:border-transparent border border-gray-200]'>
            {/* Grid Header */}
            {loading ? ( // Conditional rendering for loading spinner
                <Spinner /> // Use Spinner component
                ) : (
                    members.length > 0 ? 
            (<>
            <table className="w-full table-auto md:table hidden">
              <thead>
                <tr className="text-center font-normal text-sm border-b-[16px] border-transparent">
                  <th className="p-2">
                    <FontAwesomeIcon icon={faBars} className="mr-3 text-gray-400 hidden" />
                  </th>
                  <th className="text-left">NO</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Job</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Show</th>
                  <th className="p-2">Actions</th>
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
            <div className=" md:hidden">
            {members.map((member, index) => (
              <div className='flex flex-col justify-between items-center' key={index}>
              <TeamMember 
              key={member.id} 
              member={member} 
              index={index} 
              moveMember={handleMoveMember} 
              setEditMember={setEditMember} 
              handleDeleteMember={handleDeleteMember} 
              editMember={editMember} 
              openMobileViewModal={openMobileViewModal}
              handleEditMember={handleEditMember}
              handleInputChange={handleInputChange}
            />
            <TeamMobileViewModal
              isOpen={isMobileViewModalOpen}
              onClose={closeMobileViewModal}
              member={mobileViewMember}
              handleRejectDelete={handleDeleteMember}
            />
            </div>
            ))}
          </div>
            </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Lottie 
              animationData={noDataAnimation} 
              loop={true} 
              style={{ width: 150, height: 150 }} 
              className="mb-4"
          />
          <p className="text-gray-500 text-lg">There are no members to display.</p>
      </div>
         ))}
          </div>
      </div>
    </DndProvider>
  );
};

export default TeamPage;
