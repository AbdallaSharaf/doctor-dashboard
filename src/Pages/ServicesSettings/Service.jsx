import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@headlessui/react';
import React, {useRef, useState, useEffect} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { saveVisibilityChange, deleteService } from '../../store/slices/servicesSlice'; // Import the action
 import Swal from 'sweetalert2';

const ItemType = 'SERVICE';

const Service = ({
  service,
  index,
  moveService,
  setIsModalOpen,
}) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(service.isVisible);
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [editedService, setEditedService] = useState(null);
  const dispatch = useDispatch()


   

  // State for visibility toggle

  // Drag source
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, id: service.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
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
      moveService(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  // Connect drag source and drop target to the same ref
  drag(drop(ref));

  const handleToggleVisibility = () => {
    setIsVisible((prev) => !prev);
    if (saveTimeout) clearTimeout(saveTimeout);

    // Set new timeout for saving visibility
    const timeoutId = setTimeout(() => {
        dispatch(saveVisibilityChange({ id: service.id, isVisible }));
      }, 12000);
          setSaveTimeout(timeoutId);
  };

  
    // Delete a services service
    const handleDeleteService = async (id, name) => {
        const result = await Swal.fire({
            title: `Are you sure you want to delete ${name}?`,
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
          Swal.fire('Deleted!', `${name} has been deleted.`, 'success');
        }
      };
  
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
        await dispatch(saveVisibilityChange({ id: service.id, isVisible }));
      console.log('changed')
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return  async () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (saveTimeout) clearTimeout(saveTimeout);
      await dispatch(saveVisibilityChange({ id: service.id, isVisible }));
    };
  }, [dispatch, saveTimeout]);


  return (
    <tr
      ref={ref}
      data-handler-id={handlerId}
      onDoubleClick={setIsModalOpen}
      className={`h-14 text-sm text-center ${isDragging ? 'opacity-0' : 'opacity-100'} ${editedService ? 'bg-black' : 'cursor-grab'} ${index % 2 !== 0 ? 'bg-even-row-bg' : ''}`}
    >
          <td className="text-center w-12"><FontAwesomeIcon icon={faBars} className="mr-3 text-gray-400" /></td>
          <td className="text-center pr-6 w-10">{index + 1}</td>
          <td className="flex justify-center relative max-w-24"><img src={service.icon} className="w-12 h-12 rounded-full absolute -top-7" /></td>
          <td className="font-bold text-center w-32 truncate">{service.name}</td>
          <td className="text-center text-gray-500 max-w-20 truncate">{service.shortDescription}</td>
          <td className="text-center text-gray-500 max-w-20 truncate">{service.longDescription}</td>
          <td className="text-center w-16">
            <Switch
              checked={isVisible}
              onChange={handleToggleVisibility}
              className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-500 transition data-[checked]:bg-primary-btn dark:data-[checked]:bg-primary-btn"
            >
              <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
            </Switch>
          </td>
          <td className="space-x-2 flex items-center justify-center h-16">
            <button onClick={setIsModalOpen} className="bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-1 transition duration-150 w-20">
              Edit
            </button>
            <button onClick={() => handleDeleteService(service.id, service.name)} className=" hover:bg-gray-100 text-primary-text rounded p-1 transition duration-150 w-20">
              Delete
            </button>
          </td>
    </tr>
  );
};

export default Service;
