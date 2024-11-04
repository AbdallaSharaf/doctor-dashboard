// patientsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../helpers/Axios';

// Async Thunks for CRUD Operations

// Fetch all patients
export const fetchPatients = createAsyncThunk('patients/fetchPatients', async () => {
    const response = await axios.get('/patients.json');
    return Object.keys(response.data).map(key => ({ id: key, ...response.data[key] }));
});

// Add a new patient with a primary record
export const addPatient = createAsyncThunk(
    'patients/addPatient',
    async ({ patientData, recordData }, { rejectWithValue }) => {
        try {
            // Step 1: Add main patient data
            const patientResponse = await axios.post('/patients.json', patientData);
            const patientId = patientResponse.data.name;

            // Step 2: Add record for this patient
            await axios.post(`/patients/${patientId}/records.json`, recordData);

            return { id: patientId, ...patientData, records: [recordData] };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add a new record to an existing patient's records
export const addPatientRecord = createAsyncThunk(
    'patients/addPatientRecord',
    async ({ patientId, recordData }, { rejectWithValue }) => {
        try {
            console.log(patientId)
            // Add the new record to the specified patient's records
            const response = await axios.post(`/patients/${patientId}/records.json`, recordData);
            const recordId = response.data.name;

            return { patientId, record: { id: recordId, ...recordData } };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update an existing patient
export const updatePatient = createAsyncThunk('patients/updatePatient', async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        console.log(updatedData)
        await axios.patch(`/patients/${id}.json`, updatedData);
    } catch (error) {
        return rejectWithValue(error.message);
    }
    return { id, ...updatedData };
});

// Archive and delete a patient
export const archivePatient = createAsyncThunk(
    'patients/archivePatient',
    async (id, { getState, rejectWithValue }) => {
        try {
            // Step 1: Get the patient data from the current state
            const patient = getState().patients.list.find(patient => patient.id === id);
            if (!patient) throw new Error("Patient not found");

            // Step 2: Move patient to the archive
            await axios.post('/archive/patients.json', patient);

            // Step 3: Delete patient from the original list
            await axios.delete(`/patients/${id}.json`);

            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
// export const addFieldsToAllRecords = createAsyncThunk(
//     'patients/addFieldsToAllRecords',
//     async (_, { getState, rejectWithValue }) => {
//         try {
//             const patients = getState().patients.list;

//             // Collect all patch requests
//             const updatePromises = patients.map(async (patient) => {
//                 if (patient.records && typeof patient.records === 'object') {
//                     const updatedRecords = Object.keys(patient.records).reduce((acc, recordId) => {
//                         const record = patient.records[recordId];

//                         // Update casePhoto to casePhotos as an array
//                         acc[recordId] = {
//                             ...record,
//                             casePhotos: Array.isArray(record.casePhoto) ? record.casePhoto : [],
//                         };
//                         return acc;
//                     }, {});

//                     try {
//                         await axios.patch(`/patients/${patient.id}.json`, { records: updatedRecords });
//                         console.log('success')
//                     } catch (error) {
//                         console.log(error)
//                     }
//                     // Directly patch each patient's records
//                 }
//             });

//             // Await all patches
//             await Promise.all(updatePromises);

//             return 'All records updated successfully with casePhotos field';
//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );


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
            .addCase(addPatientRecord.pending, (state) => {
                state.loading = true;
            })
            .addCase(addPatientRecord.fulfilled, (state, action) => {
                const { patientId, record } = action.payload;
                const patient = state.list.find((p) => p.id === patientId);
                console.log("Patient before adding record:", patient); // Log the patient object
            
                if (patient) {
                    if (!Array.isArray(patient.records)) {
                        patient.records = []; // Initialize if it's not an array
                    }
                    patient.records.push(record);
                }
            })            
            .addCase(addPatientRecord.rejected, (state, action) => {
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
            .addCase(archivePatient.pending, (state) => {
                state.loading = true;
            })
            .addCase(archivePatient.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((patient) => patient.id !== action.payload);
            })
            .addCase(archivePatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // .addCase(addFieldsToAllRecords.pending, (state) => {
            //     state.loading = true;
            // })
            // .addCase(addFieldsToAllRecords.fulfilled, (state) => {
            //     state.loading = false;
            // })
            // .addCase(addFieldsToAllRecords.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            // })
    },
});

export default patientsSlice.reducer;
