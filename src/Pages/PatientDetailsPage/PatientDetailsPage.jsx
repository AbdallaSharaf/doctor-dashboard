import { useParams } from 'react-router-dom';
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

    // Sort records by dueDate in ascending order
    const sortedRecords = Object.values(patientData.records).sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate); // Ensure dueDate is in a valid date format
    });
  
  

  return (
    <div className="container mx-auto p-7">
      <h1 className="text-xl font-semibold mb-6">Patient History: {patientData.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-4 lg:gap-14 ">
        <MainDataCard patientData={patientData} />
        <div className='md:col-span-2'>
          <RecordsSystem patientId={patientData.id} patientRecords={sortedRecords} />
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
