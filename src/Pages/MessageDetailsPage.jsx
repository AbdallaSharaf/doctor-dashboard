import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../helpers/Axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faTrash, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const MessageDetailsPage = () => {
    const { id } = useParams(); // Get the message ID from the route params
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleDeleteMessage = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This message will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            await axios.delete(`/messages/${id}.json`).then(
                navigate('/messages') // Redirect after deletion
            )
        }
    };
    const handleToggleReadStatus = async () => {
        try {
            const newUnreadStatus = !message.unread; // Toggle the unread status
            const response = await axios.patch(`/messages/${id}.json`, { newUnreadStatus });
            setMessage(prev => ({ ...prev, unread: newUnreadStatus })); // Update local state
            console.log('Response from server:', response.data); // Log the server response
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };
    
    // Fetch the message data when the component is mounted
    useEffect(() => {
        const fetchMessage = async () => {
            try {
                // Fetch the message data
                const response = await axios.get(`/messages/${id}.json`);
                setMessage(response.data);
            } catch (error) {
                console.error('Error fetching message details:', error);
            }
        };

        fetchMessage();
    }, [id]);



    if (!message) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 w-full direction-rtl">
            <h2 className="text-xl font-bold mb-4">{message.subject}</h2>
            <p><strong>Sender:</strong> {message.name}</p>
            <p><strong>Phone:</strong> {message.phone}</p>
            <p className="mt-4">{message.message}</p>

            {/* Buttons for actions */}
            <div className="flex space-x-2 mt-4">
                <button onClick={() => window.open(`tel:${message.phone}`)} className="text-blue-500">
                    <FontAwesomeIcon icon={faPhone} /> Call
                </button>
                <button onClick={() => window.open(`https://wa.me/${message.phone}`)} className="text-green-500">
                    <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
                </button>
                <button onClick={handleToggleReadStatus} className={`text-${message.unread ? 'green-500' : 'yellow-500'}`}>
                    <FontAwesomeIcon icon={faEnvelope} /> {message.unread ? 'Mark as Read' : 'Mark as Unread'}
                </button>
                <button onClick={handleDeleteMessage} className="text-red-500">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
            </div>

            {/* Back button */}
            <button 
                onClick={() => navigate('/messages')} 
                className="mt-4 bg-gray-400 px-4 py-2 rounded text-white"
            >
                Back to Messages
            </button>
        </div>
    );
};

export default MessageDetailsPage;
