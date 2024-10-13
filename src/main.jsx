import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from './Pages/App.jsx';
import Layout from './Layout/Layout.jsx';
import ScrollToTop from './helpers/ScrollToTop';
import './index.css';
import Schedule from './Pages/Schedule.jsx';
import BookingDetails from './Pages/BookingDetails'; // Create this component


createRoot(document.getElementById('root')).render(
  <>
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<App />} />
          <Route path='/schedule' element={<Schedule />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
        </Route>
      </Routes>
    </HashRouter>
  </>,
);
