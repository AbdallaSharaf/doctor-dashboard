import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../helpers/Axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faTrash, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { handleMarkAsUnread, handleDeleteMessage } from '../helpers/MessageActions';

const MessageDetailsPage = () => {
    const { id } = useParams(); // Get the message ID from the route params
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

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

    const handleDelete = async () => {
        await handleDeleteMessage(id);
        navigate('/messages'); // Redirect after deletion
    };

    const toggleReadStatus = async () => {
        if (message) {
            const newUnreadStatus = !message.unread; // Toggle the unread status
            await handleMarkAsUnread(id, newUnreadStatus); // Update the status on the server
            setMessage(prev => ({ ...prev, unread: newUnreadStatus })); // Update local state
        }
    };

    if (!message) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 w-full">
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
                <button onClick={toggleReadStatus} className={`text-${message.unread ? 'green-500' : 'yellow-500'}`}>
                    <FontAwesomeIcon icon={faEnvelope} /> {message.unread ? 'Mark as Read' : 'Mark as Unread'}
                </button>
                <button onClick={handleDelete} className="text-red-500">
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
