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
          <Route path="/patient-details/:id" element={<Appointments />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/messages/:id" element={<MessageDetailsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </>,
);
