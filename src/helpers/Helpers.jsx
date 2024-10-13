import axios from './Axios'

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

export const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};