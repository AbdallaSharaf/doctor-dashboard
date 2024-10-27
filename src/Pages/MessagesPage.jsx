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
    const [selectedIds, setSelectedIds] = useState(new Set());
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

    const handleToggleReadStatus = async (message, unread) => {
        if (message) {
            const newUnreadStatus = !message.unread;
            dispatch(markAsUnread({ id: message.id, unread: newUnreadStatus }));
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
            dispatch(deleteMessage(id));
        }
    };

    
    
    const handleOpenMessage = (message) => {
        handleToggleReadStatus(message.id, {unread: false})
        navigate(`/messages/${message.id}`);
    };
    
    const handleReply = (type, phoneNumber) => {
        if (type === 'call') {
            window.open(`tel:${phoneNumber}`);
        } else if (type === 'whatsapp') {
            window.open(`https://wa.me/${phoneNumber}`);
        }
    };
    
    const handleCheckboxChange = (id) => {
        setSelectedIds(prevSelectedIds => {
            const updatedSelectedIds = new Set(prevSelectedIds);
            updatedSelectedIds.has(id) ? updatedSelectedIds.delete(id) : updatedSelectedIds.add(id);
            return updatedSelectedIds;
        });
    };
    
    const handleBulkAction = async (action) => {
        const promises = Array.from(selectedIds).map(id => action(id));
        await Promise.all(promises);
    };

    const handleToggleSelectedReadStatus = async () => {
        // Check if any selected message is unread
        const anyUnread = Array.from(selectedIds).some(id => {
            const message = messages.find(msg => msg.id === id);
            return message && message.unread;
        });
    
        // Set the new unread status based on the check
        const newUnreadStatus = !anyUnread;
    
        await handleBulkAction(async (id) => {
            console.log('clicked')
            dispatch(markAsUnread({ id: id, unread: newUnreadStatus }));
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
            await handleBulkAction(async (id) => {
                dispatch(deleteMessage(id));
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
        <div className="p-8 w-full">
            <div className='flex justify-between'>
            <h2 className="text-lg font-semibold mb-6">Messages</h2>
            
            </div>
            <div className='p-7 rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.04) border border-gray-200]'>
            <div className='flex justify-between items-center  mb-7'>
            <div className='flex gap-4 w-full'>
            <div className='w-44'>
                <CustomDropdown 
                    options={options} 
                    selectedStatus={{ value: selectedStatus, label: `${selectedStatus} Messages` }} 
                    setSelectedStatus={setSelectedStatus} 
                    />
            </div>
            {selectedIds.size > 0 && 
            <div className="flex">
                <button onClick={handleToggleSelectedReadStatus} className="bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-2 text-sm">
                    Toggle Read
                </button>
                <button onClick={handleDeleteSelected} className="ml-4 p-2 text-sm hover:bg-gray-100 rounded text-primary-text">
                    Delete All
                </button>
            </div>
            }
            </div>
            <div className="relative p-2 text-sm w-[250px]">
                <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                    type="text"
                    placeholder="Search Message"
                    className="p-2 pl-8 bg-gray-100 rounded w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            </div>
            {loading ? ( // Conditional rendering for loading spinner
                <Spinner /> // Use Spinner component
                ) : (
            <table className="min-w-full ">
                <thead className=''>
                    <tr className="text-primary-text bg-gray-100 h-14">
                        <th className="py-2 px-4 text-sm font-normal text-start">
                            <input
                                type="checkbox"
                                onChange={() => {
                                    const allSelected = currentMessages.length === selectedIds.size;
                                    const newSelectedIds = allSelected ? new Set() : new Set(currentMessages.map(msg => msg.id));
                                    setSelectedIds(newSelectedIds);
                                }}
                                checked={currentMessages.length > 0 && currentMessages.length === selectedIds.size}
                            />
                        </th>
                        <th className="py-2 px-4 font-normal text-start text-sm">Sender</th>
                        <th className="py-2 px-4 font-normal text-start text-sm">Subject</th>
                        <th className="py-2 px-4 font-normal text-start text-sm">Status</th>
                        <th className="py-2 px-4 font-normal text-start text-sm">Actions</th>
                        <th className="py-2 px-4 font-normal text-start text-sm">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMessages.map((message, index) => (
                        <tr
                            key={message.id}
                            className={` cursor-pointer ${message.unread ? 'font-bold' : ''}  h-14 ${index % 2 !== 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white hover:bg-gray-100'}`}
                            onClick={() => handleOpenMessage(message)}
                        >
                            <td className="py-2 px-4 text-sm">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(message.id)}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the event from bubbling up
                                    }}
                                    onChange={() => handleCheckboxChange(message.id)}
                                />
                            </td>
                            <td className="py-2 px-4 text-sm">{message.name}</td>
                            <td className="py-2 px-4 text-sm">{message.subject}</td>
                            <td className="py-2 pl-8 text-sm">
                                {message.unread ? (
                                    <FontAwesomeIcon onClick={async (e)=>{ e.stopPropagation(); await handleToggleReadStatus(message);}} icon={faEnvelope} className="text-red-500" />
                                ) : (
                                    <FontAwesomeIcon onClick={async (e)=>{ e.stopPropagation(); await handleToggleReadStatus(message);}} icon={faEnvelopeOpen} className="text-green-500" />
                                )}
                            </td>
                            <td className="py-2 px-4 flex space-x-2 h-14 text-lg">
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
                            <td className="py-2 px-4 text-sm">{formatTimestamp(message.timestamp)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>)}
            <div className="mt-10 flex justify-between">
            <div className="mb-4 flex justify-between items-center">
                <label htmlFor="messages-per-page" className="mr-4">Show:</label>
                <div className='w-[160px]'>
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

export default MessagesPage;
