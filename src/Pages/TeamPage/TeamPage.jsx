import React, { useEffect, useState } from 'react';
import axios from '../../helpers/Axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TeamMember from './TeamMember';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', job: '', college: '', image: '' });
  const [editMember, setEditMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode

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

  // Handle input changes for the new member form
  const handleInputChange = (e, memberSetter) => {
    const { name, value } = e.target;
    memberSetter(prev => ({ ...prev, [name]: value }));
  };

  // Add a new team member
  const handleAddMember = async () => {
    const response = await axios.post('/teamMembers.json', newMember);
    setTeamMembers([...teamMembers, { id: response.data.name, ...newMember }]);
    setNewMember({ name: '', job: '', college: '', image: '' });
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
    await axios.delete(`/teamMembers/${id}.json`);
    setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== id));
  };

  // Move member in the list (reordering)
  const moveMember = (dragIndex, hoverIndex) => {
    const draggedMember = teamMembers[dragIndex];
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(dragIndex, 1);
    updatedMembers.splice(hoverIndex, 0, draggedMember);

    setTeamMembers(updatedMembers);
  };

  // Save the new order to Firebase
  const handleSaveOrder = async () => {
    await Promise.all(teamMembers.map((member, index) => 
      axios.patch(`/teamMembers/${member.id}.json`, { order: index })
    ));
    setIsEditing(false); // Exit edit mode after saving
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full p-6">
        <h1 className="text-xl font-bold mb-4">Team Management</h1>

        {/* Add New Member Form */}
        <div className="mb-6 p-6">
          <h2 className="font-semibold mb-2">Add New Team Member</h2>
          <div className="flex space-x-4">
            <input 
              type="text" 
              name="name" 
              value={newMember.name} 
              onChange={(e) => handleInputChange(e, setNewMember)} 
              placeholder="Name" 
              className="input-field"
            />
            <input 
              type="text" 
              name="job" 
              value={newMember.job} 
              onChange={(e) => handleInputChange(e, setNewMember)} 
              placeholder="Job" 
              className="input-field"
            />
            <input 
              type="text" 
              name="college" 
              value={newMember.college} 
              onChange={(e) => handleInputChange(e, setNewMember)} 
              placeholder="College" 
              className="input-field"
            />
            <input 
              type="text" 
              name="image" 
              value={newMember.image} 
              onChange={(e) => handleInputChange(e, setNewMember)} 
              placeholder="Image URL" 
              className="input-field"
            />
            <button onClick={handleAddMember} className="btn">Add Member</button>
          </div>
        </div>

        {/* Toggle Edit Mode Button */}
        <button onClick={() => setIsEditing(prev => !prev)} className="btn mb-4">
          {isEditing ? 'Cancel Reorder' : 'Reorder Team Members'}
        </button>

        {/* Save Order Button */}
        {isEditing && (
          <button onClick={handleSaveOrder} className="btn mb-4">
            Save Order
          </button>
        )}

        {/* Grid Header */}
        <div className="grid grid-cols-4 font-semibold mb-2 text-gray-700">
          <div className="text-start pl-4">Name</div>
          <div className="text-start pl-3">Job</div>
          <div className="text-start pl-2">College</div>
          <div className="text-start pl-1">Actions</div>
        </div>

        {/* Team Members Grid */}
        <div className={`grid ${isEditing ? 'grid-cols-1' : 'grid-cols-1'} gap-4`}>
          {teamMembers.map((member, index) => (
            <TeamMember 
              key={member.id} 
              member={member} 
              index={index} 
              moveMember={isEditing ? moveMember : null} // Allow reordering only in edit mode
              setEditMember={setEditMember} 
              handleDeleteMember={handleDeleteMember} 
              editMember={editMember} 
              handleEditMember={handleEditMember}
              handleInputChange={handleInputChange}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default TeamPage;
