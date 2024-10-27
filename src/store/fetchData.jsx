import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchMessages } from './slices/messagesSlice'
import { fetchAppointments } from './slices/appointmentsSlice'
import { fetchTeamMembers } from './slices/teamSlice'
import { fetchOptions } from './slices/clinicSettingsSlice'

const FetchData = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchAppointments());
        dispatch(fetchMessages());
        dispatch(fetchTeamMembers());
        dispatch(fetchOptions('/medicines'));
        dispatch(fetchOptions('/diagnoses'));
        dispatch(fetchOptions('/jobs'));
    }, [dispatch]);
    return;
}

export default FetchData