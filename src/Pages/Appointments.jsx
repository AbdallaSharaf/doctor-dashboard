import React, { useEffect, useState } from 'react';
import axios from '../helpers/Axios';
import { capitalizeFirstLetter, convert24HourTo12Hour, convert12HourTo24Hour } from '../helpers/Helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp,  faSquareCheck, faSquareXmark, faSquarePen, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AppointmentModal from '../components/AppointmentModal';
import CustomDropdown from '../components/CustomDropdown';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem'; // Import PaginationItem




const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case 'completed':
            return 'text-blue-600 bg-blue-600';
        case 'approved':
            return 'text-green-600 bg-green-600';
        case 'ongoing':
            return 'text-yellow-600 bg-yellow-600';
        case 'pending':
            return 'text-red-600 bg-red-600';
        default:
            return 'text-gray-600';
    }
};


const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
];



const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [availableTimes, setAvailableTimes] = useState('All');
    const [editId, setEditId] = useState(null);
    const [selectedAppointments, setSelectedAppointments] = useState([]); 
    const [editData, setEditData] = useState({ name: '', phone: '', date: '', time: '', status: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage, setAppointmentsPerPage] = useState(5);
    
    //  -------------------- helpers ------------------
    const getArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <FontAwesomeIcon icon={faChevronUp} className='ml-1'/> : <FontAwesomeIcon icon={faChevronDown} className='ml-1'/>; 
        }
        return <FontAwesomeIcon icon={faChevronDown} className='ml-1'/>;
    };
    //---------------------end of helpers------------------
    
    const fetchAppointments = async () => {
        try {
            const response = await axios.get('/bookings.json');
            const data = response.data;

            const appointmentsArray = Object.keys(data).map(key => ({
                id: key,
                ...data[key],
            }));

            setAppointments(appointmentsArray);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };
    const fetchAvailableTimes = async () => {
        try {
          const response = await axios.get('/available_times.json');
          const data = response.data;
  
          const scheduleArray = Object.keys(data).map(key => ({
            date: key,
            times: data[key],
          }));
          setAvailableTimes(scheduleArray);
        } catch (error) {
          console.error("Error fetching available times:", error);
        }
      };
  
    useEffect(() => {
        fetchAvailableTimes();
        fetchAppointments();
    }, []);

    const sortBy = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

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
    
    const handleAddAppointment = async (newAppointment) => {
        const convertedTime = convert24HourTo12Hour(newAppointment.time);

        await axios.post('/bookings.json', { 
            ...newAppointment,
            time: convertedTime, // Use the converted time
            status: 'pending' // Default status
        });
            setIsModalOpen(false); // Close the modal
            fetchAppointments(); // Refresh the appointments
    };

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


    const handleApprove = async (id, prevStatus) => {
        const newStatus = prevStatus === 'pending' ? 'approved' : prevStatus;
        await axios.patch(`/bookings/${id}.json`, { status: newStatus });
        const response = await axios.get('/bookings.json');
        const data = response.data;
        const appointmentsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setAppointments(appointmentsArray);
      };

    const handleEditClick = (appointment) => {
        setEditId(appointment.id);
        setEditData({ 
            name: appointment.name, 
            phone: appointment.phone, 
            date: appointment.date, 
            time: convert12HourTo24Hour(appointment.time), 
            status: appointment.status 
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };
    

    const handleSave = async (id) => {
        const dataToBePushed = { 
            name: editData.name, 
            phone: editData.phone, 
            date: editData.date, 
            time: convert24HourTo12Hour(editData.time), 
            status: editData.status 
        }
        await axios.patch(`/bookings/${id}.json`, dataToBePushed);
        // Fetch appointments again to refresh data
        const response = await axios.get('/bookings.json');
        const data = response.data;
        const appointmentsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
        }));
        setAppointments(appointmentsArray);
        setEditId(null);
    };

    const handleRejectDelete = async (id) => {
        await axios.delete(`/bookings/${id}.json`);
        const response = await axios.get('/bookings.json');
        const data = response.data;
        const appointmentsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
        }));
        setAppointments(appointmentsArray);
    };
    const handleApproveAll = async () => {
        const updatePromises = selectedAppointments.map(id =>
            axios.patch(`/bookings/${id}.json`, { status: 'approved' })
        );
        await Promise.all(updatePromises);
        fetchAppointments(); // Refresh data
        setSelectedAppointments([]); // Clear selections
    };
    const handleAppointmentsPerPageChange = (event) => {
        setAppointmentsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to first page when changing the items per page
    };
    
    const handleDeleteAll = async () => {
        const deletePromises = selectedAppointments.map(id =>
            axios.delete(`/bookings/${id}.json`)
        );
        await Promise.all(deletePromises);
        fetchAppointments(); // Refresh data
        setSelectedAppointments([]); // Clear selections
    };
    
    const handleCheckboxChange = (id) => {
        setSelectedAppointments((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter(selectedId => selectedId !== id)
                : [...prevSelected, id]
        );
    };


    return (
        <div className="p-7 w-full">
            <div className='flex justify-between mb-6'>
            <h2 className="text-lg font-semibold">Appointments</h2>
                <button onClick={() => setIsModalOpen(true)} className="mb-2 py-2 px-4 bg-primary-btn hover:bg-hover-btn w-[170px] text-white rounded">
                    Add Appointment
                </button>
    
                <AppointmentModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    availableTimes={availableTimes}
                    handleSubmit={handleAddAppointment}
                />

            </div>
            <div className='p-7 rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.04) border border-gray-200]'>
            <div className='flex justify-between items-center'>
            <div className='flex gap-4'>
            <CustomDropdown
                options={statusOptions}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
            />
            {selectedAppointments.length > 0 && (
                <div>
                    <button className='bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-2 text-sm' onClick={handleApproveAll}>Approve All</button>
                    <button className='ml-4 p-2 text-sm hover:bg-gray-100 rounded text-primary-text' onClick={handleDeleteAll}>Delete All</button>
                </div>
            )}

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
            

            <table className="w-full border-separate border-spacing-y-3 table-auto">
                <thead>
                    <tr className='text-center'>
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
                        <tr key={appointment.id} className={`gap-x-3 h-12 text-center ${editId === appointment.id ? 'bg-black bg-opacity-20' : ''}`}>
                            <td className="p-2">
                                <input
                                type="checkbox"
                                className='scale-125'
                                checked={selectedAppointments.includes(appointment.id)}
                                onChange={() => handleCheckboxChange(appointment.id)}/>
                            </td>
                            <td className="text-sm p-2">{index + 1}</td>
                            <td className="font-bold text-sm p-2 h-7">
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
                            <td className=" text-sm p-2">
                                {editId === appointment.id ? (
                                    <input 
                                        type="text" 
                                        name="phone"
                                        value={editData.phone} 
                                        onChange={handleInputChange} 
                                        className="border border-gray-300 rounded p-1 max-w-32"
                                    />
                                ) : (
                                    appointment.phone
                                )}
                            </td>
                            <td className={``}>
                                {editId === appointment.id && (appointment.status === 'pending' || appointment.status === 'approved') ? (
                                    <select 
                                        name="status"
                                        value={editData.status} 
                                        onChange={handleInputChange} 
                                        className="h-7"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                    </select>
                                ) : (
                                    <div className={`font-semibold text-opacity-70 text-sm p-1 mx-auto rounded-md bg-opacity-20 ${getStatusClass(appointment.status)} max-w-[85px] text-center justify-center items-center`}>
                                       {capitalizeFirstLetter(appointment.status)}</div>
                                )}
                            </td>
                            <td className=" text-sm p-2">
                                {editId === appointment.id ? (
                                    <div className="flex gap-2 ">
                                        <button 
                                            onClick={() => handleSave(appointment.id)} 
                                            className="text-green-600 "
                                        >
                                            <FontAwesomeIcon icon={faSquareCheck} />
                                        </button>
                                        <button 
                                            onClick={() => setEditId(null)} 
                                            className="text-red-600 "
                                        >
                                            <FontAwesomeIcon icon={faSquareXmark} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 justify-center">
                                        <button onClick={() => handleApprove(appointment.id, appointment.status)} className="text-green-600"><FontAwesomeIcon icon={faSquareCheck}/></button>
                                        <button 
                                            onClick={() => handleEditClick(appointment)} 
                                            className="text-yellow-500"
                                        >
                                            <FontAwesomeIcon icon={faSquarePen} />
                                        </button>
                                        <button 
                                            onClick={() => handleRejectDelete(appointment.id)} 
                                            className="text-red-600"
                                        >
                                            <FontAwesomeIcon icon={faSquareXmark} />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
            <div className="mb-4">
                <label htmlFor="appointments-per-page" className="mr-2">Show:</label>
                <select
                    id="appointments-per-page"
                    value={appointmentsPerPage}
                    onChange={handleAppointmentsPerPageChange}
                    className="p-2 rounded border border-gray-300 "
                >
                    {[5, 10, 20, 50].map((option) => (
                        <option key={option} value={option}>
                            {option} per page
                        </option>
                    ))}
                </select>
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