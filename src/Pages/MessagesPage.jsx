import React, { useState, useEffect } from 'react';
import axios from '../helpers/Axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faTrash, faEnvelopeOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { handleMarkAsUnread, handleDeleteMessage } from '../helpers/MessageActions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set items per page
    const navigate = useNavigate();

    const fetchMessages = async () => {
        try {
            const response = await axios.get('/messages.json');
            const data = response.data || {};
            const fetchedMessages = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        const filtered = messages.filter(message => 
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMessages(filtered);
    }, [searchTerm, messages]);

    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
    const indexOfLastMessage = currentPage * itemsPerPage;
    const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
    const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

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

    const handleOpenMessage = (message) => {
        setMessages(prevMessages => 
            prevMessages.map(msg => msg.id === message.id ? { ...msg, unread: false } : msg)
        );
        axios.patch(`/messages/${message.id}.json`, { unread: false }).catch(error => console.error('Error marking message as read:', error));
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
        setSelectedIds(new Set());
        fetchMessages(); // Fetch updated messages after bulk action
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
                await handleDeleteMessage(id); // Ensure this also returns a promise
            });
        }
    };

    const handleMarkSelectedAsUnread = async () => {
        await handleBulkAction(async (id) => {
            await axios.patch(`/messages/${id}.json`, { unread: true });
        });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-4 w-full">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <input
                type="text"
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            {selectedIds.size > 0 && 
            <div className="flex mb-4">
                <button onClick={handleMarkSelectedAsUnread} className="bg-yellow-400 px-4 py-2 rounded text-white mr-2">
                    Mark Selected as Unread
                </button>
                <button onClick={() => handleBulkAction(async (id) => axios.patch(`/messages/${id}.json`, { unread: false }))} className="bg-blue-400 px-4 py-2 rounded text-white mr-2">
                    Mark Selected as Read
                </button>
                <button onClick={handleDeleteSelected} className="bg-red-500 px-4 py-2 rounded text-white">
                    Delete Selected
                </button>
            </div>
            }
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-start">
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
                        <th className="py-2 px-4 border-b text-start">Sender</th>
                        <th className="py-2 px-4 border-b text-start">Subject</th>
                        <th className="py-2 px-4 border-b text-start">Status</th>
                        <th className="py-2 px-4 border-b text-start">Actions</th>
                        <th className="py-2 px-4 border-b text-start">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMessages.map(message => (
                        <tr
                            key={message.id}
                            className={`hover:bg-gray-100 cursor-pointer ${message.unread ? 'font-bold' : ''}`}
                            onClick={() => handleOpenMessage(message)}
                        >
                            <td className="py-2 px-4 border-b">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(message.id)}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the event from bubbling up
                                    }}
                                    onChange={() => handleCheckboxChange(message.id)}
                                />
                            </td>
                            <td className="py-2 px-4 border-b">{message.name}</td>
                            <td className="py-2 px-4 border-b">{message.subject}</td>
                            <td className="py-2 px-4 border-b">
                                {message.unread ? (
                                    <FontAwesomeIcon icon={faEnvelope} className="text-red-500" />
                                ) : (
                                    <FontAwesomeIcon icon={faEnvelopeOpen} className="text-green-500" />
                                )}
                            </td>
                            <td className="py-2 px-4 border-b flex space-x-2">
                                <button onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleReply('call', message.phone); 
                                    fetchMessages(); 
                                }} className="text-blue-500">
                                    <FontAwesomeIcon icon={faPhone} />
                                </button>
                                <button onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleReply('whatsapp', message.phone); 
                                    fetchMessages(); 
                                }} className="text-green-500">
                                    <FontAwesomeIcon icon={faWhatsapp} />
                                </button>
                                <button onClick={async (e) => { 
                                    e.stopPropagation(); 
                                    await handleDeleteMessage(message.id); // Ensure this also returns a promise
                                    await fetchMessages(); // Wait for messages to be fetched again
                                }} className="text-red-500">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b">{formatTimestamp(message.timestamp)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className={`px-4 py-2 mr-2 ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                >
                    Previous
                </button>
                <span className="font-bold">{currentPage}</span> / <span>{totalPages}</span>
                <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className={`px-4 py-2 ml-2 ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MessagesPage;
