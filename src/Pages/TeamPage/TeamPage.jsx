import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../helpers/Axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TeamMember from './TeamMember';
import update from 'immutability-helper';
import TeamModal from '../../components/TeamModal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', job: '', college: '', image: '' });
  const [editMember, setEditMember] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility


  //--------------------------helpers--------------------------------
  const saveChangesToDatabase = async () => {
    await Promise.all(teamMembers.map((member, index) => 
      axios.patch(`/teamMembers/${member.id}.json`, { order: index })
    ));
  };
  //--------------------------end of helpers--------------------------------


  //--------------------------handlers-------------------------------
  // Handle input changes for the new member form
  const handleInputChange = (e, memberSetter) => {
    const { name, value } = e.target;
    memberSetter(prev => ({ ...prev, [name]: value }));
  };

  // Add a new team member
  const handleAddMember = async () => {
    // Check if all required fields have values
    if (!newMember.name || !newMember.job || !newMember.college || !newMember.image) {
        // Optionally, show an alert or error message to the user here
        console.error("All fields are required before adding a new team member.");
        return; // Stop if any field is missing
    }

    try {
        const response = await axios.post('/teamMembers.json', newMember);
        setTeamMembers([...teamMembers, { id: response.data.name, ...newMember }]);
        setNewMember({ name: '', job: '', college: '', image: '' }); // Reset the form
        setIsModalOpen(false); // Close the modal after adding
    } catch (error) {
        console.error("Error adding new member:", error);
    }
  };


  // Edit a team member
  const handleEditMember = async () => {
    await axios.patch(`/teamMembers/${editMember.id}.json`, editMember);
    setTeamMembers(prevMembers =>
      prevMembers.map(member => (member.id === editMember.id ? editMember : member))
    );
    setEditMember(null);
  };
  
  
  // Delete a team member
  const handleDeleteMember = async (id) => {
    const memberToDelete = teamMembers.find((member) => member.id === id);
  
    Swal.fire({
      title: `Are you sure you want to delete ${memberToDelete.name}?`,
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/teamMembers/${id}.json`);
        setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
        Swal.fire('Deleted!', `${memberToDelete.name} has been deleted.`, 'success');
      }
    });
  };
  
  
  // Move member in the list (reordering)
  const handleMoveMember = useCallback(async (dragIndex, hoverIndex) => {
    const updatedMembers = update(teamMembers, {
      $splice: [
        [dragIndex, 1], // Remove the item at dragIndex
        [hoverIndex, 0, teamMembers[dragIndex]], // Insert the item at hoverIndex
      ],
    });
  
    setTeamMembers(updatedMembers);
  
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  
    // Set a new timeout to save changes after 2 minutes
    const id = setTimeout(() => {
      saveChangesToDatabase();
    }, 120000); // 2 minutes
  
    setTimeoutId(id);
  }, [teamMembers, timeoutId]);
  
  //------------------------------end of handlers-----------------------------

  //------------------------------effects-------------------------------------
  // Fetch team members from Firebase
  useEffect(() => {
    const fetchTeam = async () => {
      const response = await axios.get('/teamMembers.json');
      const fetchedTeam = [];
      for (let key in response.data) {
        fetchedTeam.push({ id: key, ...response.data[key] });
      }
      // Sort by the order property
      fetchedTeam.sort((a, b) => a.order - b.order);
      setTeamMembers(fetchedTeam);
    };
    fetchTeam();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      saveChangesToDatabase(); // Save changes when the user is about to leave
      e.preventDefault();
      e.returnValue = '';
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(timeoutId); // Clear timeout on unmount
      saveChangesToDatabase(); // Save changes when unmounting
    };
  }, [timeoutId, teamMembers]);
  //--------------------------end 0f effects---------------------------------

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-6">
      <div className='flex justify-between mb-10'>
          <h2 className="text-lg font-semibold">Team Management</h2>
          <button onClick={() => setIsModalOpen(true)} className="mb-2 py-2 px-4 bg-primary-btn hover:bg-hover-btn w-[170px] text-white rounded">Add Member</button>
      </div>
                {/* Modal for adding new team member */}
                <TeamModal 
                    isModalOpen={isModalOpen} 
                    setIsModalOpen={setIsModalOpen} 
                    handleAddMember={handleAddMember} 
                />
        <div className='p-8 rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.04) border border-gray-200]'>
        {/* Grid Header */}
        <table className="w-full table-auto">
        <thead>
          <tr className="text-primary-text bg-gray-100 h-10 ">
            <th className="text-center font-semibold py-2"><FontAwesomeIcon icon={faBars} className="mr-3 text-gray-400 hidden" /></th>
            <th className="text-center font-semibold py-2 text-primary-text text-sm pr-6">NO</th>
            <th className="text-center font-semibold py-2 text-primary-text text-sm">Name</th>
            <th className="text-center font-semibold py-2 text-primary-text text-sm">Job</th>
            <th className="text-center font-semibold py-2 text-primary-text text-sm">Description</th>
            <th className="text-center font-semibold py-2 text-primary-text text-sm">Actions</th>
          </tr>
        </thead>

        <tbody>
          {teamMembers.map((member, index, arr) => (
            <TeamMember 
              length={arr.length}
              key={member.id} 
              member={member} 
              index={index} 
              moveMember={handleMoveMember} // Allow reordering
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
      </div>
    </DndProvider>
  );
};

export default TeamPage;