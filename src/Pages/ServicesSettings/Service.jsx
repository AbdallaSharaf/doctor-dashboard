import { faBars, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@headlessui/react';
import { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { saveVisibilityChange, deleteService } from '../../store/slices/servicesSlice';
import Swal from 'sweetalert2';
import { Collapse } from '@mui/material';

const ItemType = 'SERVICE';

const Service = ({
  service,
  index,
  moveService,
  setIsModalOpen,
}) => {
  const ref = useRef();
  const { subServices: subservices } = service;
  const [isVisible, setIsVisible] = useState(service.isVisible);
  const [saveTimeout, setSaveTimeout] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  // Drag and drop setup (same as before)
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, id: service.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: ItemType,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (draggedItem, monitor) => {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      moveService(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    if (saveTimeout) clearTimeout(saveTimeout);

    const timeoutId = setTimeout(() => {
      dispatch(saveVisibilityChange({ id: service.id, isVisible: newVisibility }));
    }, 12000);
    setSaveTimeout(timeoutId);
  };

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
      await dispatch(deleteService({ id }));
      Swal.fire('Deleted!', `${name} has been deleted.`, 'success');
    }
  };

  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      await dispatch(saveVisibilityChange({ id: service.id, isVisible }));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return async () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (saveTimeout) clearTimeout(saveTimeout);
      await dispatch(saveVisibilityChange({ id: service.id, isVisible }));
    };
  }, [dispatch, saveTimeout, isVisible, service.id]);
  console.log(subservices)
  return (
    <>
      {/* Main Service Row */}
      <tr
        ref={ref}
        data-handler-id={handlerId}
        onDoubleClick={() => setIsModalOpen(service)}
        onClick={() => setExpanded(!expanded)} 
        className={`h-14 text-sm text-center ${isDragging ? 'opacity-0' : 'opacity-100'} ${index % 2 !== 0 ? 'bg-even-row-bg' : ''}`}
      >
        <td className="text-center w-12">
          <FontAwesomeIcon icon={faBars} className="mr-3 text-gray-400" />
        </td>
        <td className="text-center pr-6 w-10">{index + 1}</td>
        <td className="flex justify-center relative max-w-24">
          <img src={service.icon} className="w-12 h-12 rounded-full absolute -top-7" alt="" />
        </td>
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
        <td className="space-x-2 flex items-center justify-center h-16" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setIsModalOpen(service)} 
            className="bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-1 transition duration-150 w-20"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDeleteService(service.id, service.name)} 
            className="hover:bg-gray-100 text-primary-text rounded p-1 transition duration-150 w-20"
          >
            Delete
          </button>
        </td>
      </tr>

      {/* Subservices */}
      {subservices.length > 0 && (
<tr>
  <td colSpan={8} className="p-0">
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <table className="w-full">
        <thead className="">
          <tr>
            <th className="w-3"></th>
            <th className="w-10"></th>
            <th className="w-10"></th>
            <th className="w-16"></th>
            <th className="w-20"></th>
            <th className="w-20"></th>
            <th className="w-16"></th>
            <th className="w-40"></th>
          </tr>
        </thead>
        <tbody>
          {subservices.map((subservice, subIndex) => (
            <tr 
              key={subservice.id}
              className={`h-14 text-sm text-center ${subIndex % 2 !== 0 ? 'bg-even-row-bg' : ''}`}
            >
              <td className="text-center w-9"></td>
              <td className="text-center pr-6 w-10">{subIndex + 1}</td>
              <td className="flex justify-center relative max-w-24">
                <img src={subservice.icon} className="w-12 h-12 rounded-full absolute -top-7" alt="" />
              </td>
              <td className="font-bold text-center w-16 truncate">{subservice.name}</td>
              <td className="text-center text-gray-500 max-w-20 truncate">{subservice.shortDescription}</td>
              <td className="text-center text-gray-500 max-w-20 truncate">{subservice.longDescription}</td>
              <td className="text-center w-16">
                <Switch
                  checked={subservice.isVisible}
                  onChange={() => dispatch(saveVisibilityChange({ 
                    id: subservice.id, 
                    isVisible: !subservice.isVisible 
                  }))}
                  className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-500 transition data-[checked]:bg-primary-btn dark:data-[checked]:bg-primary-btn"
                >
                  <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                </Switch>
              </td>
              <td className="space-x-2 flex items-center justify-center h-16">
                <button 
                  onClick={() => {setIsModalOpen(subservice); console.log(subservice)}} 
                  className="bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-1 transition duration-150 w-20"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteService(subservice.id, subservice.name)} 
                  className="hover:bg-gray-100 text-primary-text rounded p-1 transition duration-150 w-20"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Collapse>
  </td>
</tr>
      )}
    </>
  );
};

export default Service;