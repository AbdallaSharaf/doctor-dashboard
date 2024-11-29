import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from './Pages/Homepage/App.jsx';
import Layout from './helpers/Layout/Layout.jsx';
import ScrollToTop from './helpers/ScrollToTop';
import './index.css';
import Schedule from './Pages/Schedule.jsx';
import Appointments from './Pages/Appointments.jsx';
import MessageDetailsPage from './Pages/MessageDetailsPage.jsx'
import MessagesPage from './Pages/MessagesPage.jsx';
import TeamPage from './Pages/TeamPage/TeamPage.jsx';
import PatientDetailsPage from './Pages/PatientDetailsPage/PatientDetailsPage.jsx';
import ClinicSettings from './Pages/ClinicSettings/ClinicSettings.jsx';
import AddPatient from './Pages/AddPatient.jsx';
import Patients from './Pages/Patients.jsx';
import NotFound from './Pages/404Page.jsx';
import { Provider } from 'react-redux';
import Store from './store/Store.jsx';
import FetchData from './store/fetchData.jsx';
import ServicesPage from './Pages/ServicesSettings/Services.jsx';
import Authentication from './Pages/Authentication.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <HashRouter>
    <Provider store={Store}>
      <FetchData/>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<App />} />
          <Route path='/schedule' element={<Schedule />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patients/patient-details/:id" element={<PatientDetailsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/clinic-settings" element={<ClinicSettings />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/messages/:id" element={<MessageDetailsPage />} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/create-user" element={<Authentication />} />
          <Route path="/services" element={<ServicesPage />} />
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Provider>,
    </HashRouter>
  </>,
);


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/doctor-dashboard/service-worker.js')
    .then(registration => {
    })
    .catch(error => {
    });
}
