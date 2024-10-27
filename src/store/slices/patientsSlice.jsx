// patientsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../helpers/Axios';

// Async Thunks for CRUD Operations

// Fetch all patients
export const fetchPatients = createAsyncThunk('patients/fetchPatients', async () => {
    const response = await axios.get('/patients.json');
    return Object.keys(response.data).map(key => ({ id: key, ...response.data[key] }));
});

// Add a new patient
export const addPatient = createAsyncThunk('patients/addPatient', async (newPatient) => {
    const response = await axios.post('/patients.json', newPatient);
    return { id: response.data.name, ...newPatient }; // Firebase assigns ID in the `name` property
});

// Update an existing patient
export const updatePatient = createAsyncThunk('patients/updatePatient', async ({ id, updatedData }) => {
    await axios.patch(`/patients/${id}.json`, updatedData);
    return { id, ...updatedData };
});

// Archive and delete a patient
export const deletePatient = createAsyncThunk('patients/deletePatient', async (id) => {
    await axios.delete(`/patients/${id}.json`);  
    return id;
});

// Patients Slice
const patientsSlice = createSlice({
    name: 'patients',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Patients
            .addCase(fetchPatients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatients.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchPatients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add Patient
            .addCase(addPatient.pending, (state) => {
                state.loading = true;
            })
            .addCase(addPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(addPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update Patient
            .addCase(updatePatient.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePatient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex((patient) => patient.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = { ...state.list[index], ...action.payload };
                }
            })
            .addCase(updatePatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Archive and Delete Patient
            .addCase(deletePatient.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePatient.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((patient) => patient.id !== action.payload);
            })
            .addCase(deletePatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default patientsSlice.reducer;
