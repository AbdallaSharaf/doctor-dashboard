import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@headlessui/react';
import React, {useRef, useState, useEffect} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import axios from '../../helpers/Axios';

const ItemType = 'TEAM_MEMBER';

const TeamMember = ({
  member,
  index,
  moveMember,
  setEditMember,
  handleDeleteMember,
  editMember,
  handleEditMember,
  handleInputChange,
}) => {
  const ref = useRef();
  const fileInputRef = useRef(); // Reference for file input
  const [isVisible, setIsVisible] = useState(member.isVisible);
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [hasChanges, setHasChanges] = useState(false); // Track if there are unsaved changes


  // State for visibility toggle

  // Drag source
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, id: member.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  console.log(isVisible)
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

  // Function to open file input dialog
  const handleImageEdit = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };

  const handleToggleVisibility = () => {
    setIsVisible(prev => !prev);
    setHasChanges(true); // Mark as having changes

    // Clear any existing timeout and set a new one
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeoutId = setTimeout(handleSaveVisibilityChange, 12000);
    setSaveTimeout(timeoutId);
  };

  const handleSaveVisibilityChange = async () => {
    const updatedMember = { ...member, isVisible }; // Use the local state value
    try {
      await axios.put(`/teamMembers/${member.id}.json`, updatedMember);
      setHasChanges(false); // Reset changes flag after saving
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
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
  
  
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        handleSaveVisibilityChange(); // Save on unload if there are changes
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (saveTimeout) clearTimeout(saveTimeout); // Cleanup the timeout
      if (hasChanges) {
        handleSaveVisibilityChange(); // Save changes when unmounting
      }
    };
  }, [hasChanges, saveTimeout]);


  return (
    <tr
    ref={ref}
    data-handler-id={handlerId}
    onDoubleClick={() => setEditMember(member)}
    className={`h-16 ${isDragging ? 'opacity-0' : 'opacity-100'} ${editMember ? 'bg-black' : 'cursor-grab'} ${index % 2 !== 0 ? 'bg-gray-100' : 'bg-white'}`}
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
        <td className="text-center">
            <Switch
              checked={isVisible}
              onChange={handleToggleVisibility}
              className={`${member.isVisible ? 'bg-green-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Toggle visibility</span>
              <span
                className={`${member.isVisible ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
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
        <td className="text-center">
            <Switch
              checked={isVisible}
              onChange={handleToggleVisibility}
              className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
              >
                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
            </Switch>
        </td>
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
