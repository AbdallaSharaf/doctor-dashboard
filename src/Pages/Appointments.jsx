import React, { useEffect, useRef, useState } from 'react';
import { capitalizeFirstLetter, convert24HourTo12Hour, convert12HourTo24Hour } from '../helpers/Helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AppointmentModal from '../components/modals/AppointmentModal';
import CustomDropdown from '../components/CustomDropdown';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem'; // Import PaginationItem
import ActionsDropdown from '../components/AppointmentsActionsDropdown';
import Swal from 'sweetalert2';
import BulkActionsDropdown from '../components/BulkActionsDropdown';
import { useDispatch, useSelector } from 'react-redux';
import Lottie from 'lottie-react';
import noDataAnimation from '../assets/Animation - 1730816811189.json'
import PhoneWithActions from '../components/PhoneWithActions';

import {
    addAppointment,
    updateAppointment,
    deleteAppointment,
} from '../store/slices/appointmentsSlice';
import Spinner from '../components/Spinner';


const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case 'completed':
            return 'text-blue-600 bg-blue-600';
        case 'approved':
            return 'text-green-600 bg-green-600';
        case 'ongoing':
            return 'text-red-600 bg-red-600';
        case 'pending':
            return 'text-yellow-600 bg-yellow-600';
        case 'cancelled':
            return 'text-gray-600 bg-gray-600'; // Color for "Cancelled"
        default:
            return 'text-gray-600';
    }
};


const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'approved', label: 'Approved' },
];

const editableStatusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Cancelled', value: 'cancelled' },
]



const Appointments = () => {
    const appointments = useSelector(state => state.appointments.list);
    const loading = useSelector(state => state.appointments.loading);
    const dispatch = useDispatch();
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [editId, setEditId] = useState(null);
    const [selectedAppointments, setSelectedAppointments] = useState([]); 
    const [editData, setEditData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage, setAppointmentsPerPage] = useState(5);
    const [phoneHovered, setPhoneHovered] = useState(false);
    const patients = useSelector(state => state.patients.list)
    const navigate = useNavigate()
    const rowRef = useRef(); // Ref for the editable row
    
    //  -------------------- helpers ------------------
    const getArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <FontAwesomeIcon icon={faChevronUp} className='ml-1'/> : <FontAwesomeIcon icon={faChevronDown} className='ml-1'/>; 
        }
        return <FontAwesomeIcon icon={faChevronDown} className='ml-1'/>;
    };
    
    
    const sortBy = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    //---------------------end of helpers------------------
    
    //----------------------------memos----------------------------
    const sortedAppointments = React.useMemo(() => {
        let sortableAppointments = [...appointments];
    
        if (sortConfig.key) {
            sortableAppointments.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
    
                // Custom sorting logic for time
                if (sortConfig.key === 'time') {
                    aValue = convert12HourTo24Hour(a.time);
                    bValue = convert12HourTo24Hour(b.time);
                }
    
                // Use localeCompare for string comparison, especially for names
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return aValue.localeCompare(bValue, 'ar', { sensitivity: 'base' }) * (sortConfig.direction === 'ascending' ? 1 : -1);
                }
    
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableAppointments;
    }, [appointments, sortConfig]);
    
    
    
    const filteredAppointments = React.useMemo(() => {
        return sortedAppointments.filter((appointment) => {
            const nameMatch = appointment.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const phoneMatch = appointment.phone?.toLowerCase().includes(searchQuery.toLowerCase());
            const statusMatch = selectedStatus === 'All' || appointment.status === selectedStatus;
            return (nameMatch || phoneMatch) && statusMatch;
        });
    }, [sortedAppointments, searchQuery, selectedStatus]);
    
    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    
    //---------------------------------end of memos-----------------------------------------------


    //-------------------------handlers----------------------------
    
    const handleAddAppointment = async (newAppointment) => {
        const convertedTime = convert24HourTo12Hour(newAppointment.time);
        
        await dispatch(addAppointment({
            ...newAppointment,
            time: convertedTime,
            status: 'pending'
        }));
        setIsModalOpen(false); // Close the modal
    };
    
    
    
    
    const handleChangeStatus = async (id, newStatus) => {
        await dispatch(updateAppointment({ id: id, updatedData: { status: newStatus } }));
    };
    
    const handleEditClick = (appointment) => {
        setEditId(appointment.id);
        setEditData({ 
            ...appointment,
            time: convert12HourTo24Hour(appointment.time), 
        });
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };
    
const handleBulkAction = async (action) => {

    try {
        // Define status message for each action type
        const actionMessages = {
            approve: 'approved',
            pending: 'pending',
            cancelled: 'cancelled',
            delete: 'deleted'
        };

        if (action === 'message') {
            // Handle custom message action here if needed
            return;
        }

        // Perform the selected bulk action
        if (action === 'delete') {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete the selected appointments. This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete them!',
                cancelButtonText: 'Cancel'
            });
    
            if (result.isConfirmed) {
                try {
                    await Promise.all(selectedAppointments.map(async id => await dispatch(deleteAppointment(id))));
                     // Show success Swal
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: `The selected appointments have been deleted.`,
                        timer: 1000,
                        showConfirmButton: false
                    });
                } catch (error) {
                    console.error('Error deleting appointment:', error);
                    Swal.fire('Error!', 'There was a problem deleting the appointment.', 'error');
                }
            }
            
        } else {
            await Promise.all(selectedAppointments.map(id => handleChangeStatus(id, actionMessages[action])));
        }

        // Reset selected appointments after successful action
        setSelectedAppointments([]);

    } catch (error) {
        console.error('Error updating status:', error);
        
        // Show error Swal
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'There was a problem processing the bulk action. Please try again later.',
            confirmButtonText: 'OK'
        });
    }
};
                
                        
    const handleSave = async (id) => {
        const dataToBePushed = { 
            ...editData,
            time: convert24HourTo12Hour(editData.time), 
        };
        try {
            await dispatch(updateAppointment({ id, updatedData: dataToBePushed }));
            setEditId(null);
            console.log("Appointment saved successfully."); // Log success message
        } catch (error) {
            console.error("Error saving appointment:", error); // Log the error message
        }
    };
    
    
    const handleDeleteAppointment = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This appointment will be deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            try {
                await dispatch(deleteAppointment(id));
                Swal.fire('Deleted!', 'The appointment has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting appointment:', error);
                Swal.fire('Error!', 'There was a problem deleting the appointment.', 'error');
            }
        }
    };
    
    
    const handleAddPatient = async (appointment) => {
        // Extract necessary data from the appointment
        const patientData = {
            name: appointment.name,
            phone: appointment.phone,
            age: appointment.age,
            gender: appointment.gender,
            problem: appointment.problem,
            appointmentDate: appointment.date,
            appointmentTime: appointment.time,
        };
        
        // Check for existing patients by phone number
        const existingPatient = patients.find(patient => patient.phone === patientData.phone);
    
        if (existingPatient) {
            // Show SweetAlert prompt if patient already exists
            Swal.fire({
                title: 'Patient Already Exists',
                text: 'A patient with this phone number already exists. Would you like to view their data or add a new record?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Add Record',
                cancelButtonText: 'View Data'
            }).then((result) => {
                if (result.isConfirmed) {
                    // If user chooses to add a record, navigate to patient details and trigger modal open
                    navigate(`/patients/patient-details/${existingPatient.id}`, {
                        state: { openAddRecordModal: true }  // Pass state to open modal
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // If user chooses to view data, navigate to patient details without opening the modal
                    navigate(`/patients/patient-details/${existingPatient.id}`);
                }
            });
        } else {
            // If no matching patient, navigate to add-patient form with pre-filled data
            navigate('/add-patient', { state: { patientData } });
        }
    };
    
    

    const handleReply = (type, phoneNumber) => {
        if (type === 'call') {
            window.open(`tel:${phoneNumber}`);
        } else if (type === 'whatsapp') {
            console.log('clicked')
            window.open(`https://wa.me/${phoneNumber}`);
        }
    };
    
    const handleCopyPhone = (phone) => {
        navigator.clipboard.writeText(phone)
          .then(() => {
            alert('Phone number copied!');
          })
          .catch((err) => {
            console.error('Error copying phone number:', err);
          });
      };

    const handleCheckboxChange = (id) => {
        setSelectedAppointments((prevSelected) =>
            prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
        );
    };
//--------------------------------------end of handlers--------------------------------------


//------------------------------------------effects------------------------------------------
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (rowRef.current && !rowRef.current.contains(event.target)) {
                if (editId !== null) {
                    handleSave(editId); // Call handleSave even if no input changes detected
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Always remove the event listener on cleanup
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editId, editData]); // Dependency on editId


    useEffect(() => {
        setCurrentPage(1)
    }, [appointmentsPerPage]); // Dependency on editId

//--------------------------------------end of effects--------------------------------------

return (
    <div className="p-7 ">
            <div className='flex justify-between mb-6'>
            <h2 className="text-lg font-semibold">Appointments</h2>
                <button onClick={() => setIsModalOpen(true)} className="mb-2 py-2 px-4 bg-primary-btn hover:bg-hover-btn w-[170px] text-white rounded">
                    Add Appointment
                </button>
    
                <AppointmentModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    handleSubmit={handleAddAppointment}
                />

            </div>
            <div className='p-7 rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.04)] border border-gray-200]'>
            <div className='flex justify-between items-center mb-6'>
            <div className='flex gap-4 items-center'>
            <div className='w-[140px]'>
            <CustomDropdown
                options={statusOptions}
                selectedStatus={{ value: selectedStatus, label: `${selectedStatus}` }}
                setSelectedStatus={setSelectedStatus}
            />
            </div>
            <div>
                <BulkActionsDropdown handleBulkAction={handleBulkAction} isActive={selectedAppointments.length > 0}/>
            </div>
            </div>
            <div className="relative p-2 text-sm">
                <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                    type="text"
                    placeholder="Search Appointment"
                    className="p-2 pl-8 bg-gray-100 rounded w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            </div>
            
            {loading ? ( // Conditional rendering for loading spinner
                <Spinner /> // Use Spinner component
                ) : (
                    currentAppointments.length > 0 ? 
            ( <table className="w-full table-auto">
                <thead>
                    <tr className='text-center border-b-[16px] border-white'>
                        <th className="px-2 ">
                            <input
                            type="checkbox"
                            className='scale-125'
                            onChange={(e) =>
                                setSelectedAppointments(
                                    e.target.checked ? filteredAppointments.map(app => app.id) : []
                                )
                            }
                            checked={selectedAppointments.length === filteredAppointments.length && filteredAppointments.length > 0}/>
                        </th>
                        <th className=" font-normal text-sm p-2">NO</th>
                        <th className=" font-normal text-sm p-2 cursor-pointer" onClick={() => sortBy('name')}>
                            Patient Name {getArrow('name')}
                        </th>
                        <th className=" font-normal text-sm p-2 cursor-pointer" onClick={() => sortBy('date')}>
                            Date {getArrow('date')}
                        </th>
                        <th className=" font-normal text-sm p-2 cursor-pointer" onClick={() => sortBy('time')}>
                            Time {getArrow('time')}
                        </th>
                        <th className=" font-normal text-sm p-2">Phone Number</th>
                        <th className=" font-normal text-sm  cursor-pointer w-fit" onClick={() => sortBy('status')}>
                            Status {getArrow('status')}
                        </th>
                        <th className=" font-normal text-sm p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAppointments.map((appointment, index) => (
                        <tr ref={editId === appointment.id ? rowRef : null} onDoubleClick={() => handleEditClick(appointment)} key={appointment.id} className={`h-14 text-center ${editId === appointment.id ? 'bg-black bg-opacity-20' : ''} ${index % 2 ===0 ? 'bg-gray-100 bg-opacity-80':''}`}>
                            <td className="p-2">
                                <input
                                type="checkbox"
                                className='scale-125'
                                checked={selectedAppointments.includes(appointment.id)}
                                onChange={() => handleCheckboxChange(appointment.id)}/>
                            </td>
                            <td className="text-sm p-2">{index + 1}</td>
                            <td className="font-bold text-sm p-2">
                                {editId === appointment.id ? (
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={editData.name} 
                                        onChange={handleInputChange} 
                                        className="border max-w-40 border-gray-300 rounded p-1"
                                    />
                                ) : (
                                    appointment.name
                                )}
                            </td>
                            <td className=" text-sm p-2">
                            {editId === appointment.id ? (
                                    <input 
                                    type='date'
                                    name="date"
                                    value={editData.date} 
                                    onChange={handleInputChange} 
                                    className=""/>
                                ) : (
                                    appointment.date
                                )}
                            </td>
                            <td className=" text-sm p-2">
                                {editId === appointment.id ? (
                                    <input 
                                        type='time'
                                        name="time"
                                        value={editData.time} 
                                        onChange={handleInputChange} 
                                        className=""
                                    />
                                ) : (
                                    appointment.time
                                )}
                            </td>
                            <td className="text-sm p-2" onMouseEnter={() => setPhoneHovered(appointment.id)} onMouseLeave={() => setPhoneHovered(null)}>
                                {editId === appointment.id ? (
                                    <input 
                                        type="text" 
                                        name="phone"
                                        value={editData.phone} 
                                        onChange={handleInputChange} 
                                        className="border border-gray-300 rounded p-1 max-w-32"
                                    />
                                ) : (
                                    <PhoneWithActions phone={appointment.phone} handleCopyPhone={handleCopyPhone} handleReply={handleReply} isHovered={phoneHovered} id={appointment.id}/>
                                )}
                            </td>
                            <td className={``}>
                                {editId === appointment.id && (appointment.status === 'pending' || appointment.status === 'approved' || appointment.status === 'cancelled') ? (
                                    <div className='w-[125px] mx-auto'>
                                        <CustomDropdown
                                            options={editableStatusOptions}
                                            selectedStatus={{ value: editData.status, label: `${editData.status}` }}
                                            setSelectedStatus={(status) =>
                                                setEditData((prev) => ({ ...prev, status }))
                                            }
                                        />
                                    </div>
                                ) : (
                                    <div className={`font-semibold text-opacity-70 text-sm p-1 mx-auto rounded-md bg-opacity-20 ${getStatusClass(appointment.status)} max-w-[85px] text-center justify-center items-center`}>
                                       {capitalizeFirstLetter(appointment.status)}</div>
                                )}
                            </td>
                            <td className=" text-sm p-2">
                                {editId === appointment.id ? (
                                    <div className="space-x-2 mx-auto flex items-center justify-center h-[38px]">
                                        <button onClick={() =>handleSave(editId)} className="bg-green-500 hover:bg-green-400 text-secondary-text rounded p-1  transition duration-150 w-16">
                                            Save
                                        </button>
                                        <button onClick={() => setEditId(null)} className="bg-red-500 text-white py-1 rounded-md hover:bg-red-400 transition duration-150 w-16">
                                            Discard
                                        </button>
                                    </div>
                                ) : (
                                    <ActionsDropdown
                                        appointment={appointment}
                                        handleChangeStatus={handleChangeStatus}
                                        handleEditClick={handleEditClick}
                                        handleRejectDelete={handleDeleteAppointment}
                                        handleReply={handleReply}
                                        handleAddPatient={handleAddPatient}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>) : (
         <div className="flex flex-col items-center justify-center h-64 space-y-4">
         <Lottie 
             animationData={noDataAnimation} 
             loop={true} 
             style={{ width: 150, height: 150 }} 
             className="mb-4"
         />
         <p className="text-gray-500 text-lg">There are no appointments to display.</p>
     </div>
        ))}
            <div className="mt-4 flex justify-between">
            <div className="mb-4 flex justify-between items-center">
                <label htmlFor="appointments-per-page" className="mr-4">Show:</label>
                <div className='w-[150px]'>
                <CustomDropdown 
                    options={[5, 10, 20, 50, 100].map(option => ({ value: option, label: `${option} per page` }))} 
                    selectedStatus={{ value: appointmentsPerPage, label: `${appointmentsPerPage} per page` }} 
                    setSelectedStatus={(selected) => setAppointmentsPerPage(selected)} 
                />
                </div>
            </div>    
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                shape="rounded"
                color="#1B84FF"
                siblingCount={1} // Show one sibling on each side of the current page
                boundaryCount={1} 
                renderItem={(item) => (
                    <PaginationItem {...item} />
                )}
            />
            </div>
        </div>
        </div>
    );
};

export default Appointments;