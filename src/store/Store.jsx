import { configureStore } from '@reduxjs/toolkit';
import teamReducer from './slices/teamSlice';
import clinicSettingsReducer from './slices/clinicSettingsSlice'
import messagesReducer from './slices/messagesSlice'
import appointmentsReducer from './slices/appointmentsSlice'
import patientsReducer from './slices/patientsSlice'

const store = configureStore({
  reducer: {
    team: teamReducer,
    clinicSettings: clinicSettingsReducer,
    messages: messagesReducer,
    appointments: appointmentsReducer,
    patients: patientsReducer,
  },
});

export default store;
