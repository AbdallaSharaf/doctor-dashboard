import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useRef} from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'TEAM_MEMBER';

const TeamMember = ({
  length,
  member,
  index,
  moveMember,
  setEditMember,
  handleDeleteMember,
  editMember,
  handleEditMember,
  handleInputChange
}) => {
  const ref = useRef();
  const fileInputRef = useRef(); // Reference for file input

  // Drag source
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, id: member.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  console.log(length)
  // Drop target
  const [{ handlerId }, drop] = useDrop({
    accept: ItemType,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (draggedItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveMember(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  // Connect drag source and drop target to the same ref
  drag(drop(ref));

  // Use the isDragging state to change styles
  const opacity = isDragging ? 0 : 1; // Set opacity of the main item to 0 when dragging
  const backgroundColor = isDragging ? '#f0f0f0' : 'white'; // Change background color while dragging


  // Function to open file input dialog
  const handleImageEdit = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader(); // Create a new FileReader instance
  
      // Set up a callback to run when the file is read
      reader.onloadend = () => {
        setEditMember((prevMember) => ({
          ...prevMember,
          image: reader.result, // Use the data URL from the FileReader
        }));
  
        // Set the image preview if needed
        setImagePreview(reader.result);
      };
  
      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  };
  
  


  return (
    <tr
    ref={ref}
    data-handler-id={handlerId}
    onDoubleClick={() => setEditMember(member)}
    style={{ opacity, backgroundColor }} // Apply styles based on dragging state
    className={`h-16 ${editMember ? 'bg-black bg-opacity-20' : 'cursor-grab'} ${length !== index+1 ? 'border-b border-gray-200':'border-none'}`}
    >
    {editMember && editMember.id === member.id ? (
        <>
        <td className=" text-sm text-center"><FontAwesomeIcon icon={faBars} className="mr-3 text-gray-400" /></td>
        <td className=" text-sm text-center pr-6">{index+1}</td>
        <td className="flex justify-center relative">
            <img
              src={editMember.image}
              className="w-12 h-12 rounded-full absolute -top-7 cursor-pointer"
              onClick={handleImageEdit} // Trigger image edit on click
              alt="Team member"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange} // Handle the file input change
            />
          </td>
        <td>
            <input
            type="text"
            name="name"
            value={editMember.name}
            onChange={(e) => handleInputChange(e, setEditMember)}
            className="border p-2 rounded-md focus:outline-none text-sm text-center focus:ring-2 flex justify-center mx-auto focus:ring-blue-400"
            placeholder="Name"
            />
        </td>
        <td>
            <input
            type="text"
            name="job"
            value={editMember.job}
            onChange={(e) => handleInputChange(e, setEditMember)}
            className="border p-2 rounded-md focus:outline-none text-sm text-center focus:ring-2 flex justify-center mx-auto focus:ring-blue-400"
            placeholder="Job"
            />
        </td>
        <td>
            <input
            type="text"
            name="description"
            value={editMember.description}
            onChange={(e) => handleInputChange(e, setEditMember)}
            className="border p-2 rounded-md focus:outline-none text-sm text-center focus:ring-2 flex justify-center mx-auto focus:ring-blue-400"
            placeholder="Description"
            />
        </td>
        <td className="space-x-2 mx-auto flex items-center justify-center h-16">
            <button onClick={handleEditMember} className="bg-green-500 hover:bg-green-400 text-secondary-text rounded p-1  transition duration-150 w-20">
            Save
            </button>
            <button onClick={() => setEditMember(null)} className="bg-red-500 text-white py-1 rounded-md hover:bg-red-400 transition duration-150 w-20">
            Discard
            </button>
        </td>
        </>
    ) : (
        <>
        <td className="text-sm text-center"><FontAwesomeIcon icon={faBars} className="mr-3 text-gray-400" /></td>
        <td className=" text-sm text-center pr-6 ">{index+1}</td>
        <td className="flex justify-center relative"><img src={member.image} className="w-12 h-12 rounded-full absolute -top-7"/></td>
        <td className="font-bold text-sm text-center">{member.name}</td>
        <td className="text-sm text-center text-gray-500">{member.job}</td>
        <td className="text-sm text-center text-gray-500">{member.description}</td>
        <td className="space-x-2 flex items-center justify-center h-16">
            <button onClick={() => setEditMember(member)} className="bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-1  transition duration-150 w-20">
            Edit
            </button>
            <button onClick={() => handleDeleteMember(member.id)} className="bg-white hover:bg-gray-100 text-primary-text rounded p-1  transition duration-150 w-20">
            Delete
            </button>
        </td>
        </>
    )}
    </tr>

  );
};

export default TeamMember;
