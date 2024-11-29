import React from 'react';
import { useSelector } from 'react-redux';
import { formatDateTime } from '../../helpers/Helpers';
import WeekAppointments from './WeekAppointments';
import TodayAppointments from './TodayAppointments';
import RevenueGraph from './RevenueGraph';
import PatientsStatistics from './PatientStatistics';
import PerformanceAnalysis from './PerfomanceAnalysis';

const App = () => {
  const currentTime = new Date();
  const appointments = useSelector((state) => state.appointments.list);
  const patients = useSelector((state) => state.patients.list);

  return (
    <div className="p-4 bg-primary-bg">
      {/* Header Section */}
      <header className="mb-6">
        <div>
          <h1 className="text-2xl font-bold sidebar">
            Welcome, Dr. Smith!
          </h1>
          <p className="text-lg font-medium sidebar opacity-60">
            {formatDateTime(currentTime)}
          </p>
        </div>
      </header>

      {/* Today's Appointments */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-y-10 md:gap-10'>
        <TodayAppointments appointments={appointments}/>
        <RevenueGraph patients={patients} />
        <div className='col-span-3 grid grid-cols-1 gap-y-10'>
          <PatientsStatistics patients={patients} />
          <WeekAppointments appointments={appointments} />
        </div>
        <PerformanceAnalysis patients={patients} appointments={appointments} />
      </div>
    </div>
  );
};

export default App;
