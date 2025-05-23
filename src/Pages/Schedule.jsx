import React, { useEffect, useState } from 'react';
import axios from '../helpers/Axios';
import { pushAvailableDatesWithTimes, getFirstName } from '../helpers/Helpers';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [datesWithTimes, setDatesWithTimes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  const saveAvailabilityToDatabase = async () => {
    const dataToPush = datesWithTimes.map(({ date, times }) => ({
      date,
      times,
    }));
    
    await pushAvailableDatesWithTimes(dataToPush);
  };

  const toggleAvailability = async (date, time) => {
    const updatedTimes = datesWithTimes.map(slot => {
      if (slot.date === date) {
        return {
          ...slot,
          times: slot.times.map(t => 
            t.time === time ? { ...t, available: !t.available } : t
          ),
        };
      }
      return slot;
    });
  
    setSchedule(updatedTimes);
    setDatesWithTimes(updatedTimes);
  
    // Clear the previous timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  
    // Set a new timeout to save changes after 2 minutes
    const id = setTimeout(() => {
      saveAvailabilityToDatabase();
    }, 120000); // 2 minutes
  
    setTimeoutId(id); // Save the new timeout ID
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      saveAvailabilityToDatabase();
      e.preventDefault();
      e.returnValue = '';
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timeoutId) {
        clearTimeout(timeoutId); // Clear timeout on unmount
      }
      saveAvailabilityToDatabase(); // Save changes when unmounting
    };
  }, [timeoutId]);
  

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('/available_times.json');
        const data = response.data;
        const scheduleArray = Object.keys(data).map(key => ({
          date: key,
          times: data[key],
        }));
        console.log(scheduleArray)
        setSchedule(scheduleArray);
        setDatesWithTimes(scheduleArray);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get('/bookings.json'); // Fetch bookings from Firebase
        const data = response.data;
    
        const bookingsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
    
        setBookings(bookingsArray); // Store the bookings in state
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchSchedule();
    fetchBookings(); // Fetch bookings on component mount
  }, []);

  // Prepare data for rendering
  const timeSlots = datesWithTimes.length > 0 ? datesWithTimes[0].times.map(time => time.time) : [];

  // Function to check if a time slot has a booking
  const getBookingForTimeSlot = (date, time) => {
    return bookings.find(booking => booking.date === date && booking.time === time);
  };

  return (
    <div className="p-5 w-full">
      <h2 className="text-2xl font-bold mb-4">Schedule</h2>
      <table className="min-w-full border-collapse  border overflow-y-auto border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Time</th>
            {schedule.map((slot, index) => (
              <th key={index} className="border border-gray-300 p-2">{slot.date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot, timeIndex) => (
            <tr key={timeIndex}>
              <td className="border border-gray-300 p-2">{timeSlot}</td> {/* Format time */}
              {schedule.map((slot) => {
                const currentTimeSlot = slot.times.find(t => t.time === timeSlot);
                const isAvailable = currentTimeSlot ? currentTimeSlot.available : false;
                const booking = getBookingForTimeSlot(slot.date, timeSlot);

                return (
                  <td 
                    onClick={() => !booking && toggleAvailability(slot.date, timeSlot)}
                    key={slot.date} 
                    className={`border cursor-pointer h-[65px] min-w-28 text-white text-center border-gray-300  ${booking ? 'bg-yellow-500' : isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
                    
                    {booking ? (
                      <>
                        <div>{getFirstName(booking.name)}</div>
                        <div>{booking.phone}</div>
                      </>
                    ) : (
                      isAvailable ? 'Available' : 'Unavailable'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
