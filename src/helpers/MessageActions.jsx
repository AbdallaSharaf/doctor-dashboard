import axios from './Axios'; // Update this path based on your project structure
import Swal from 'sweetalert2';


// Mark message as unread
export const handleMarkAsUnread = async (id, unread) => {
    try {
        const response = await axios.patch(`/messages/${id}.json`, { unread });
        console.log('Response from server:', response.data); // Log the server response
    } catch (error) {
        console.error('Error updating message:', error);
    }
};

// Delete the message
export const handleDeleteMessage = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This message will be permanently deleted!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
        await axios.delete(`/messages/${id}.json`);
    }
};
