import axios from './Axios'
import { format } from 'date-fns';
import { uploadPhotoToCloudinary } from '../cloudinary';

export const uploadPhoto = async (file) => {
    try {
        // Use the new Cloudinary function
        const uploadResult = await uploadPhotoToCloudinary(file);
        
        // Cloudinary provides a secure URL in the response
        console.log('File available at:', uploadResult.secure_url);
        return uploadResult.secure_url; // Return the URL for further use
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // Handle the error as needed
    }
};

export const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random hex color
  };

export const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'approved', label: 'Approved' },
];


export const getStatusClass = (status) => {
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


export const clearPastDatesFromFirebase = async () => {
    try {
        const today = new Date(); // Get today's date as a Date object
        const formattedToday = today.toISOString().split('T')[0]; // Format for comparison
        const startDate = new Date(today); // Create a new Date object for startDate
        startDate.setDate(today.getDate() + 2); // Set startDate to two days from today
        const response = await axios.get('/available_times.json');
        const availableTimes = response.data;

        if (availableTimes) {
            // Loop through the existing dates
            const deleteRequests = Object.keys(availableTimes)
                .filter(date => date < formattedToday) // Filter for past dates
                .map(async (pastDate) => {
                    await axios.delete(`/available_times/${pastDate}.json`);
                    console.log(`Deleted available times for past date: ${pastDate}`);
                });

            await Promise.all(deleteRequests); // Wait for all delete requests to finish
        }
    } catch (error) {
        console.error('Error clearing past dates from Firebase:', error);
    }
};

// Push available dates and times to Firebase
export const pushAvailableDatesWithTimes = async (datesWithTimes) => {
    try {
        await clearPastDatesFromFirebase();

        const requests = datesWithTimes.map(async ({ date, times }) => {
            await axios.put(`/available_times/${date}.json`, times);
        });

        await Promise.all(requests); // Wait for all requests to finish
    } catch (error) {
        console.error('Error pushing available times to Firebase:', error);
    }
};

export const formatDateTime = (dateTimeString) => {
    return format(new Date(dateTimeString), 'MMMM d, yyyy'); // Format to "October 23, 2024 5:19 PM"
};

export const capitalizeFirstLetter = (word) => {
    if (!word) return ""; // Check for empty input
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export const getFirstName = (fullName) => {
    if (!fullName) return "";
    return fullName.split(" ")[0];
}

export const convert24HourTo12Hour = (time24) => {
    // Check if the input time format is valid (HH:MM)
    if (!time24 || typeof time24 !== 'string' || !/^\d{2}:\d{2}$/.test(time24)) {
        throw new Error('Invalid time format. Please use HH:MM format.');
    }

    const [hourString, minutes] = time24.split(':');
    let hours = parseInt(hourString, 10); // Convert hours to a number
    let period = 'AM';
  
    if (hours >= 12) {
        period = 'PM';
        if (hours > 12) {
            hours -= 12; // Convert to 12-hour format
        }
    } else if (hours === 0) {
        hours = 12; // Midnight case
    }
  
    // Ensure minutes are formatted as two digits
    const formattedMinutes = minutes.padStart(2, '0');

    const formattedTime = `${hours}:${formattedMinutes} ${period}`;
    return formattedTime;
};


export const convert12HourTo24Hour = (time12) => {
    const [time, period] = time12.split(' '); // Split into time and period (AM/PM)
    let [hours, minutes] = time.split(':'); // Split into hours and minutes
    hours = parseInt(hours, 10); // Convert hours to a number

    if (period === 'PM' && hours < 12) {
        hours += 12; // Convert PM hours to 24-hour format
    } else if (period === 'AM' && hours === 12) {
        hours = 0; // Convert 12 AM to 0 hours
    }

    // Pad hours and minutes to ensure they are two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
};

