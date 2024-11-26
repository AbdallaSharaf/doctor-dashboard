import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faTrash, faEnvelopeOpen, faEnvelope, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem'; // Import PaginationItem
import CustomDropdown from '../components/CustomDropdown';
import Spinner from '../components/Spinner'; // Import Spinner
import {  markAsUnread, deleteMessage } from '../store/slices/messagesSlice'; // Import actions from your slice
import { useDispatch, useSelector } from 'react-redux';
import Lottie from 'lottie-react';
import noDataAnimation from '../assets/Animation - 1730816811189.json'
import SelectAllCheckbox from '../components/checkbox/SelectAllCheckbox';
import IndividualCheckbox from '../components/checkbox/IndividualCheckbox';
import { formatDateTime } from '../helpers/Helpers';

const options = [
    { value: 'all', label: 'All Messages' },
    { value: 'read', label: 'Read Messages' },
    { value: 'unread', label: 'Unread Messages' }
];


const MessagesPage = () => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.messages.data);
    const loading = useSelector(state => state.messages.loading);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage, setMessagesPerPage] = useState(5);
    const [selectedStatus, setSelectedStatus] = useState('all'); // Default to 'all'

    const navigate = useNavigate();
    
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
    
    //---------- helper function ----------
    
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(date);
    };

    //---------- end of helper function ----------
    
    //---------- handlers ----------

    const handleToggleReadStatus = async (message) => {
        if (message) {
            const newUnreadStatus = !message.unread;
            await dispatch(markAsUnread({ id: message.id, unread: newUnreadStatus }));
        }
    };

    const handleMarkAsRead = async (message) => {
        if (message && message.unread) {
            await dispatch(markAsUnread({ id: message.id, unread: false })); // Always mark as read
        }
    };

    // Delete the message
    const handleDeleteMessage = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This message will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            await dispatch(deleteMessage(id));
        }
    };

    
    
    const handleOpenMessage = (message) => {
        handleMarkAsRead(message, {unread: false})
        navigate(`/messages/${message.id}`);
    };
    
    const handleReply = (type, phoneNumber) => {
        if (type === 'call') {
            window.open(`tel:${phoneNumber}`);
        } else if (type === 'whatsapp') {
            window.open(`https://wa.me/${phoneNumber}`);
        }
    };
    
    const handleCheckboxChange = (message) => {
        setSelectedMessages((prevSelectedMessages) => {
            const exists = prevSelectedMessages.find((msg) => msg.id === message.id);
            if (exists) {
                // If the message is already selected, remove it
                return prevSelectedMessages.filter((msg) => msg.id !== message.id);
            } else {
                // Otherwise, add the message to the selection
                return [...prevSelectedMessages, message];
            }
        });
    };
    
    
    const handleBulkAction = async (action) => {
        const promises = Array.from(selectedMessages).map(message => action(message));
        await Promise.all(promises);
    };

    const handleToggleSelectedReadStatus = async () => {
        // Check if any selected message is unread
        const anyUnread = selectedMessages.some((message) => message.unread);
    
        // Set the new unread status based on the check
        const newUnreadStatus = !anyUnread;
    
        await handleBulkAction(async (message) => {
            await dispatch(markAsUnread({ id: message.id, unread: newUnreadStatus }));
        });
    };
    
    const handleDeleteSelected = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'These messages will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete them!',
        });
    
        if (result.isConfirmed) {
            await handleBulkAction(async (message) => {
                await dispatch(deleteMessage(message.id));
            });
        }
    };
    
    
    
    //---------- end of handlers ----------

    useEffect(() => {
        const filtered = messages.filter(message => 
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        // Filter by read/unread status based on selectedStatus
        const filteredByStatus = filtered.filter(message => {
            if (selectedStatus === 'read') return !message.unread; // Only read messages
            if (selectedStatus === 'unread') return message.unread; // Only unread messages
            return true; // Show all messages if 'all' is selected
        });
    
        // Sort filtered messages to have unread messages at the top
        const sortedMessages = filteredByStatus.sort((a, b) => {
            const dateA = new Date(a.timestamp); // Convert to Date object
            const dateB = new Date(b.timestamp); // Convert to Date object
    
            if (a.unread === b.unread) {
                // Both are either unread or read, sort by timestamp (most recent first)
                return dateB - dateA; // Most recent first
            }
            return a.unread ? -1 : 1; // Unread messages come first
        });
    
        setFilteredMessages(sortedMessages);
    }, [searchTerm, messages, selectedStatus]); // Include selectedStatus in dependencies    
    
    
    return (
        <div className="p-7 w-full">
            <h2 className="text-lg font-semibold mb-6">Messages</h2>
            <div className='bg-table-container-bg p-4 md:p-7 rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.04)] dark:border-transparent border border-gray-200]'>
            <div className='flex justify-between items-center mb-6'>
            <div className='flex md:gap-4 items-center'>
            <div className='min-w-44'>
                <CustomDropdown 
                    options={options} 
                    selectedStatus={{ value: selectedStatus, label: `${selectedStatus} Messages` }} 
                    setSelectedStatus={setSelectedStatus} 
                    />
            </div>
            <div className="hidden md:flex">
                <button disabled={!selectedMessages.length>0} onClick={handleToggleSelectedReadStatus} className={`bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-2 text-sm ${!selectedMessages.length > 0 ? 'cursor-not-allowed opacity-50' : ''}`}>
                    Toggle Read
                </button>
                <button disabled={!selectedMessages.length>0} onClick={handleDeleteSelected} className={`ml-4 p-2 text-sm rounded text-primary-text ${!selectedMessages.length > 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}`}>
                    Delete All
                </button>
            </div>
            </div>
            <div className="relative p-2 text-sm">
                <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                />
                <input
                    type="text"
                    placeholder="Search Message"
                    className="p-2 pl-8 bg-primary-bg rounded w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            </div>
            {loading ? ( // Conditional rendering for loading spinner
                <Spinner /> // Use Spinner component
                ) : (
                    messages.length > 0 ? 
            (<> 
            <table className="w-full table-auto md:table hidden">
                <thead>
                    <tr className="border-b-[16px] border-transparent font-normal text-sm ">
                        <th className="px-2">
                            <SelectAllCheckbox selectedEntries={selectedMessages} setSelectedEntries={setSelectedMessages} entries={messages}/>
                        </th>
                        <th className="p-2 ">Sender</th>
                        <th className="p-2 ">Subject</th>
                        <th className="p-2 ">Status</th>
                        <th className="p-2 ">Actions</th>
                        <th className="p-2 ">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMessages.map((message, index) => (
                        <tr
                            key={message.id}
                            className={` cursor-pointer ${message.unread ? 'font-bold' : ''}  h-14 text-sm ${index % 2 === 0 ? 'bg-even-row-bg' : ''} text-center`}
                            onClick={() => handleOpenMessage(message)}
                        >
                            <td className="p-2" onClick={(e) => e.stopPropagation()}>
                                <IndividualCheckbox entry={message} selectedEntries={selectedMessages} handleCheckboxChange={handleCheckboxChange} />
                            </td>
                            <td className="p-2">{message.name}</td>
                            <td className="p-2">{message.subject}</td>
                            <td className="py-2 text-sm">
                                {message.unread ? (
                                    <FontAwesomeIcon onClick={async (e)=>{ e.stopPropagation(); await handleToggleReadStatus(message);}} icon={faEnvelope} className="text-red-500" />
                                ) : (
                                    <FontAwesomeIcon onClick={async (e)=>{ e.stopPropagation(); await handleToggleReadStatus(message);}} icon={faEnvelopeOpen} className="text-green-500" />
                                )}
                            </td>
                            <td className="grid grid-cols-3 gap-2 items-center h-14 justify-center w-fit mx-auto text-xl">
                                <button onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleReply('call', message.phone); 
                                    
                                }} className="text-blue-500">
                                    <FontAwesomeIcon icon={faPhone} />
                                </button>
                                <button onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleReply('whatsapp', message.phone); 
                                    
                                }} className="text-green-500">
                                    <FontAwesomeIcon icon={faWhatsapp} />
                                </button>
                                <button onClick={async (e) => { 
                                    e.stopPropagation(); 
                                    await handleDeleteMessage(message.id); // Ensure this also returns a promise
                                }} className="text-red-500">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                            <td className="p-2">{formatTimestamp(message.timestamp)}</td>
                        </tr>
                    ))}
                </tbody>
            </table> 
            <div className='flex flex-col justify-between items-center md:hidden'>
                {currentMessages.map((message, id) => (
                    <div onClick={() => handleOpenMessage(message)} className={`${id % 2 ===0 ? 'bg-even-row-bg':''}  w-full px-3 py-2`} key={id}>
                    <div className='flex justify-between items-center w-full mb-1' onClick={() => openMobileViewModal(message)}>
                        <div className='flex gap-3 items-center'>
                        <div className={`w-3 h-3 rounded-full ${message.unread ? 'bg-blue-500':'bg-transparent'}`}/>
                        <div>
                            <p className='font-medium leading-none text-lg'>{message.name}</p>
                        </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                        <p className={`text-sm leading-none font-medium pt-[4px]`}>{formatDateTime(message.timestamp)}</p>
                        </div>
                    </div>
                    <div className='pl-6'>
                    <p>{message.subject}</p>
                    <p className='text-sm mt-1 font-thin'>{message.message}</p>
                    </div>
                    </div>
                ))}
            </div>
            </>) : (
         <div className="flex flex-col items-center justify-center h-64 space-y-4">
         <Lottie 
             animationData={noDataAnimation} 
             loop={true} 
             style={{ width: 150, height: 150 }} 
             className="mb-4"
         />
         <p className="text-gray-500 text-lg">There are no messages to display.</p>
     </div>
        ))}
            <div className="mt-4 flex justify-center md:justify-between text-secondary-text">
            <div className="mb-4 justify-between items-center hidden md:flex">
                <label htmlFor="messages-per-page" className="mr-4 text-primary-text">Show:</label>
                <div className='w-[150px]'>
                <CustomDropdown 
                    options={[5, 10, 20, 50, 100].map(option => ({ value: option, label: `${option} per page` }))} 
                    selectedStatus={{ value: messagesPerPage, label: `${messagesPerPage} per page` }} 
                    setSelectedStatus={setMessagesPerPage} 
                />
                </div>
            </div>
            <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
            renderItem={(item) => (
                <PaginationItem
                {...item}
                classes={{
                    root: "text-primary-text dark:text-primary-text", // Default text color
                    selected: "bg-pagination-500-important dark: bg-pagination-500-dark-important", // Use the important class
                }}
                />
            )}
            />
            </div>
            </div>
        </div>
    );
};

export default MessagesPage;
