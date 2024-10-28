import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner'; // Assuming you have a spinner component
import { formatDateTime, capitalizeFirstLetter } from '../helpers/Helpers';

const PatientDetailsPage = () => {
  const { phone } = useParams();  // Get phone number from the URL
  const patients = useSelector(state => state.patients.list); // Get patients from Redux store
  const loading = useSelector(state => state.patients.loading); // Loading state from Redux

  // Find the patient based on the phone number
  const patientData = patients.find(patient => patient.phone === phone) || null;

  if (loading) {
      return <Spinner />; // Show loading spinner if loading
  }

  if (!patientData) {
      return <div>No patient found</div>; // Handle case when patient is not found
  }

  return (
    <div className="container mx-auto p-10">
        <h1 className="text-2xl font-bold">Patient History: {patientData.name}</h1>
    <div className='grid grid-cols-3 gap-10'>
    <div>
      <div className="bg-white shadow-md rounded-lg py-8 px-9 mt-4 w-full">
        <img src="https://placehold.co/100" alt="" className='rounded-full w-100 h-100 mx-auto my-4'/>
        <p className='text-center font-medium mb-2 text-xl'>{patientData.name}</p>
        <div className='text-center w-full'>
            <p className='px-2 py-1 bg-blue-400 bg-opacity-20 text-blue-400 font-medium text-sm w-fit mx-auto rounded-md mb-6'>Placeholder</p>
        </div>
        <p className='text-center mb-4'>No. of records: <span className='font-medium'>{Object.keys(patientData.records).length}</span></p>
        <div className='flex items-center justify-between  pb-2 border-b border-opacity-50 border-gray-300'>
            <h3 className='font-medium'>Details</h3>
            <button className='px-4 py-2 bg-blue-400 bg-opacity-20 text-blue-400 font-medium text-sm w-fit rounded-md'>Edit</button>
        </div>
        <div className='text-sm my-4'>
            <p className='font-medium mb-1'>Phone:</p>
            <p className='text-primary-text text-opacity-50'>{patientData.phone}</p>
        </div>
        <div className='text-sm my-4'>
            <p className='font-medium mb-1'>Age:</p>
            <p>{patientData.age}</p>
        </div>
        <div className='text-sm my-4'>
            <p className='font-medium mb-1'>Gender:</p>
            <p>{capitalizeFirstLetter(patientData.gender)}</p>
        </div>
        <div className='text-sm my-4'>
            <p className='font-medium mb-1'>First Appointment Date:</p>
            <p>{formatDateTime(patientData.firstAppointmentDate)}</p>
        </div>
        <div className='text-sm my-4'>
            <p className='font-medium mb-1'>Last Appointment Date:</p> 
            <p>{formatDateTime(patientData.lastAppointmentDate)}</p>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
