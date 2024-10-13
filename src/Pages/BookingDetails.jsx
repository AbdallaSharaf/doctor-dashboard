import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../helpers/Axios';
import { formatTime } from '../helpers/Helpers';

const BookingDetails = () => {
  const { id } = useParams(); // Get the booking ID from the URL
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/bookings/${id}.json`); // Fetch specific booking from Firebase
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
      <p><strong>Name:</strong> {booking.name}</p>
      <p><strong>Age:</strong> {booking.age}</p>
      <p><strong>Phone:</strong> {booking.phone}</p>
      <p><strong>Gender:</strong> {booking.gender}</p>
      <p><strong>Problem:</strong> {booking.problem}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Time:</strong> {formatTime(booking.time)}</p>
    </div>
  );
};

export default BookingDetails;
