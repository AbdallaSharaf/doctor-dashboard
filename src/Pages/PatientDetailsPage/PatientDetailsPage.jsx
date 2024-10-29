import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../components/Spinner';
import MainDataCard from './MainDataCard';
import RecordsSystem from './RecordsSystem';

const PatientDetailsPage = () => {
  const { id } = useParams();
  const patients = useSelector(state => state.patients.list);
  const loading = useSelector(state => state.patients.loading);
  
  const patientData = patients.find(patient => patient.id === id) || null;



  if (loading) {
    return <Spinner />;
  }

  if (!patientData) {
    return <div>No patient found</div>;
  }

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold">Patient History: {patientData.name}</h1>
      <div className="grid grid-cols-3 gap-10 ">
        <MainDataCard patientData={patientData} />
        <div className='col-span-2'>
          <RecordsSystem patientId={patientData.id} patientRecords={patientData.records}/>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
