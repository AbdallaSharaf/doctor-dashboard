import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchMessages } from './slices/messagesSlice'
import { fetchAppointments } from './slices/appointmentsSlice'
import { fetchTeamMembers } from './slices/teamSlice'
import { fetchOptions } from './slices/clinicSettingsSlice'
import { fetchPatients } from './slices/patientsSlice'
import { fetchServices } from './slices/servicesSlice'


const FetchData = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchAppointments());
        dispatch(fetchMessages());
        dispatch(fetchTeamMembers());
        dispatch(fetchPatients());
        dispatch(fetchOptions('/medicines'));
        dispatch(fetchOptions('/diagnoses'));
        dispatch(fetchOptions('/jobs'));
        dispatch(fetchServices());
    }, [dispatch]);
    return;
}

export default FetchData