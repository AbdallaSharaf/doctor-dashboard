import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../helpers/Axios'; // Adjust the path as needed

const PatientDetailsPage = () => {
  const { phone } = useParams();  // Get phone number from the URL
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all patient data and filter by phone number
    const fetchPatientData = async () => {
      try {
        const response = await axios.get('/patients.json');
        const patients = response.data;

        // Check if there is valid data
        if (patients) {
          // Filter patient by phone number
          const filteredPatient = Object.values(patients).find(
            (patient) => patient.phone === phone
          );

          setPatientData(filteredPatient || null);
        } else {
          // If no patients are found, set data to null
          setPatientData(null);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setPatientData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [phone]);

  if (loading) {
    return <div>Loading patient details...</div>;
  }

  if (!patientData) {
    return <div>No patient data found for this phone number.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Patient History: {patientData.name}</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        <h2 className="text-xl font-semibold mb-2">Patient Details</h2>
        <p><strong>Name:</strong> {patientData.name}</p>
        <p><strong>Phone:</strong> {patientData.phone}</p>
        <p><strong>Age:</strong> {patientData.age}</p>
        <p><strong>Gender:</strong> {patientData.gender}</p>
        <p><strong>Problem:</strong> {patientData.problem}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Appointment History</h2>
        {patientData.appointments ? (
          <ul>
            {patientData.appointments.map((appointment, index) => (
              <li key={index} className="mb-2">
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsPage;
