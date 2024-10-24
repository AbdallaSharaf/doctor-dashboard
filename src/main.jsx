import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from './Pages/App.jsx';
import Layout from './helpers/Layout/Layout.jsx';
import ScrollToTop from './helpers/ScrollToTop';
import './index.css';
import Schedule from './Pages/Schedule.jsx';
import BookingDetails from './Pages/BookingDetails'; // Create this component
import Appointments from './Pages/Appointments.jsx';
import MessageDetailsPage from './Pages/MessageDetailsPage.jsx'
import MessagesPage from './Pages/MessagesPage.jsx';
import TeamPage from './Pages/TeamPage/TeamPage.jsx';
import PatientDetailsPage from './Pages/PatientDetailsPage.jsx';
import ClinicSettings from './Pages/ClinicSettings/ClinicSettings.jsx';
import AddPatient from './Pages/AddPatient.jsx';


createRoot(document.getElementById('root')).render(
  <>
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<App />} />
          <Route path='/schedule' element={<Schedule />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/patient-details/:phone" element={<PatientDetailsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/clinic-settings" element={<ClinicSettings />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/messages/:id" element={<MessageDetailsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </>,
);
