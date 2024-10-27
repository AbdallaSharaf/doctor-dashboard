// appointmentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../helpers/Axios';

// Async Thunks for CRUD Operations

// Fetch all appointments
export const fetchAppointments = createAsyncThunk('appointments/fetchAppointments', async () => {
    const response = await axios.get('/bookings.json');
    console.log(response.data)
    return Object.keys(response.data).map(key => ({ id: key, ...response.data[key] }));
});

// Add a new appointment
export const addAppointment = createAsyncThunk('appointments/addAppointment', async (newAppointment) => {
    const response = await axios.post('/bookings.json', { ...newAppointment, status: 'pending' });
    return { id: response.data.name, ...newAppointment }; // Firebase assigns ID in the `name` property
});

// Update an existing appointment
export const updateAppointment = createAsyncThunk('appointments/updateAppointment', async ({ id, updatedData }) => {
    await axios.patch(`/bookings/${id}.json`, updatedData);
    return { id, ...updatedData };
});

// Delete an appointment
export const deleteAppointment = createAsyncThunk('appointments/deleteAppointment', async (id) => {
    await axios.delete(`/bookings/${id}.json`);
    return id;
});

// Appointments Slice
const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Appointments
            .addCase(fetchAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add Appointment
            .addCase(addAppointment.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(addAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update Appointment
            .addCase(updateAppointment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAppointment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex((appt) => appt.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = { ...state.list[index], ...action.payload };
                }
            })
            .addCase(updateAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete Appointment
            .addCase(deleteAppointment.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((appt) => appt.id !== action.payload);
            })
            .addCase(deleteAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default appointmentsSlice.reducer;
