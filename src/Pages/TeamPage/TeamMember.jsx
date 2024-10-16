import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'TEAM_MEMBER';

const TeamMember = ({
  member,
  index,
  moveMember,
  setEditMember,
  handleDeleteMember,
  editMember,
  handleEditMember,
  handleInputChange
}) => {
  const ref = React.useRef(null);

  // Drag source
  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  // Drop target
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveMember(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <li ref={ref} className="grid grid-cols-4 gap-4 items-center p-4 mb-2 bg-white shadow-md rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
      {editMember && editMember.id === member.id ? (
        <>
          <input
            type="text"
            name="name"
            value={editMember.name}
            onChange={(e) => handleInputChange(e, setEditMember)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Name"
          />
          <input
            type="text"
            name="job"
            value={editMember.job}
            onChange={(e) => handleInputChange(e, setEditMember)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Job"
          />
          <input
            type="text"
            name="college"
            value={editMember.college}
            onChange={(e) => handleInputChange(e, setEditMember)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="College"
          />
          <div className='flex gap-2'>
          <button onClick={handleEditMember} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150">
            Save
          </button>
          <button onClick={() => setEditMember(null)} className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-150">
            Discard
          </button>
          </div>
        </>
      ) : (
        <>
          <span className="font-bold text-lg">{member.name}</span>
          <span className="text-sm text-gray-500">{member.job}</span>
          <span className="text-sm text-gray-500">{member.college}</span>
          <div className="space-x-2 flex">
            <button onClick={() => setEditMember(member)} className="bg-yellow-400 text-white px-3 py-1 rounded-md w-1/2 hover:bg-yellow-500 transition duration-150">
              Edit
            </button>
            <button onClick={() => handleDeleteMember(member.id)} className="bg-red-500 text-white px-3 py-1 rounded-md w-1/2 hover:bg-red-600 transition duration-150">
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TeamMember;
