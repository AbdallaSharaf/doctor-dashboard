// servicesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../helpers/Axios';

// Async Thunks for CRUD Operations

// Async Thunk for Fetching Services
export const fetchServices = createAsyncThunk('services/fetchServices', async () => {
    const response = await axios.get('/services.json');
    const servicesData = await Promise.all(
        Object.keys(response.data).map(async key => {
            const service = { id: key, ...response.data[key] };
            // Fetch sub-services if any
            const subResponse = await axios.get(`/services/${key}/subServices.json`);
            service.subServices = subResponse.data ? Object.keys(subResponse.data).map(subKey => ({
                id: subKey,
                ...subResponse.data[subKey]
            })) : [];
            return service;
        })
    );
    return servicesData;
});


// Add a new service with optional sub-services
export const addService = createAsyncThunk(
    'services/addService',
    async ({ serviceData, mainServiceId }, { rejectWithValue }) => {
        console.log(mainServiceId)
        console.log(serviceData)
        
        try {
            if (mainServiceId) {
                // Add sub-service
                const response = await axios.post(`/services/${mainServiceId}/subServices.json`, serviceData);
                console.log(response)
                return { mainServiceId, id: response.data.name, ...serviceData };
            } else {
                // Add main service
                const response = await axios.post('/services.json', serviceData);
                console.log(serviceData)
                return { id: response.data.name, ...serviceData };
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk for Updating Service or Sub-Service
export const editService = createAsyncThunk(
    'services/editService',
    async ({ id, updatedData, mainServiceId }, { rejectWithValue }) => {
        try {
            if (mainServiceId) {
                // Update sub-service
                await axios.patch(`/services/${mainServiceId}/subServices/${id}.json`, updatedData);
            } else {
                // Update main service
                await axios.patch(`/services/${id}.json`, updatedData);
            }
            return { id, updatedData, mainServiceId }; // Return relevant data for updating state
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const saveServiceOrder = createAsyncThunk(
    'services/saveServiceOrder',
    async ({ services, mainServiceId = null }, { rejectWithValue }) => {
        try {
            const results = await Promise.all(
                services.map(async (service, index) => {
                    try {
                        // Define the endpoint URL based on whether it’s a main or sub-service
                        const url = mainServiceId 
                            ? `/services/${mainServiceId}/subServices/${service.id}.json`
                            : `/services/${service.id}.json`;
                        
                        // Attempt to patch with order
                        const response = await axios.patch(url, { order: index });
                        console.log(url)
                        return { id: service.id, status: 'success' };
                    } catch (error) {
                        // Capture individual failures with service ID and error message
                        return { id: service.id, status: 'failed', error: error.message };
                    }
                })
            );

            // Filter for any failed requests and reject if any exist
            const failedResults = results.filter(result => result.status === 'failed');
            if (failedResults.length > 0) {
                console.error('Some patches failed:', failedResults);
                return rejectWithValue(failedResults);
            }

            return results; // Return all results for further inspection if needed
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async Thunk for Deleting Service or Sub-Service
export const deleteService = createAsyncThunk(
    'services/deleteService',
    async ({ id, mainServiceId }, { rejectWithValue }) => {
        try {
            console.log(id)
            if (mainServiceId) {
                // Delete sub-service
                await axios.delete(`/services/${mainServiceId}/subServices/${id}.json`);
                return { id, mainServiceId }; // Return for state update
            } else {
                // Delete main service
                await axios.delete(`/services/${id}.json`);
                return { id }; // Return for state update
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Define the async thunk to save the visibility change
export const saveVisibilityChange = createAsyncThunk(
    'services/saveVisibilityChange',
    async ({ id, isVisible, mainServiceId = null }, { rejectWithValue }) => {
        try {
            // Check if the service or sub-service exists before updating
            const url = mainServiceId 
                ? `/services/${mainServiceId}/subServices/${id}.json`
                : `/services/${id}.json`;

            const exists = await axios.get(url);
            if (!exists.data) {
                console.warn(`Service or sub-service with ID ${id} not found.`);
                return rejectWithValue(`Service not found`);
            }
            
            // Proceed with updating visibility if it exists
            const response = await axios.patch(url, { isVisible });
            return { id, isVisible: response.data.isVisible, mainServiceId };
        } catch (error) {
            console.error('Error updating visibility status:', error);
            return rejectWithValue(error.message);
        }
    }
);

  

// Services Slice
const servicesSlice = createSlice({
    name: 'services',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        reorderServices: (state, action) => {
            const { dragIndex, hoverIndex, mainServiceId = null } = action.payload;
        
            if (mainServiceId) {
                // Reorder sub-services within a specific main service
                const mainService = state.list.find(service => service.id === mainServiceId);
                if (mainService && mainService.subServices) {
                    // Copy sub-services array for immutability
                    const updatedSubServices = [...mainService.subServices];
                    
                    // Move the item within the sub-services array
                    const [movedSubService] = updatedSubServices.splice(dragIndex, 1);
                    updatedSubServices.splice(hoverIndex, 0, movedSubService);
                    
                    // Update the main service with the reordered sub-services
                    mainService.subServices = updatedSubServices;
                }
            } else {
                // Reorder main services
                const updatedServices = [...state.list];
                
                // Move the item within the main services array
                const [movedService] = updatedServices.splice(dragIndex, 1);
                updatedServices.splice(hoverIndex, 0, movedService);
                
                // Update the main service list with the reordered services
                state.list = updatedServices;
            }
        }        
    },
    extraReducers: (builder) => {
        builder
        // Add Service
        .addCase(fetchServices.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchServices.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload; // Update list with fetched services
        })
        .addCase(fetchServices.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(addService.pending, (state) => {
                state.loading = true;
            })
            .addCase(addService.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.mainServiceId) {
                    // If it's a sub-service, find the main service and add it
                    const { mainServiceId, ...subService } = action.payload;
                    const mainService = state.list.find(service => service.id === mainServiceId);
                    if (mainService) {
                        if (!mainService.subServices) {
                            mainService.subServices = []; // Initialize if not already an array
                        }
                        mainService.subServices.push(subService);
                    }
                } else {
                    // If it's a main service, add it to the list
                    state.list.push(action.payload);
                }
            })
            .addCase(addService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update Service or Sub-Service
            .addCase(editService.pending, (state) => {
                state.loading = true;
            })
            .addCase(editService.fulfilled, (state, action) => {
                state.loading = false;
                const { id, updatedData, mainServiceId } = action.payload;
                if (mainServiceId) {
                    const mainService = state.list.find(service => service.id === mainServiceId);
                    if (mainService) {
                        const subServiceIndex = mainService.subServices.findIndex(subService => subService.id === id);
                        if (subServiceIndex !== -1) {
                            mainService.subServices[subServiceIndex] = { ...mainService.subServices[subServiceIndex], ...updatedData };
                        }
                    }
                } else {
                    const index = state.list.findIndex(service => service.id === id);
                    if (index !== -1) {
                        state.list[index] = { ...state.list[index], ...updatedData };
                    }
                }
            })
            .addCase(editService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete Service or Sub-Service
            .addCase(deleteService.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.loading = false;
                const { id, mainServiceId } = action.payload;
                if (mainServiceId) {
                    const mainService = state.list.find(service => service.id === mainServiceId);
                    if (mainService) {
                        mainService.subServices = mainService.subServices.filter(subService => subService.id !== id);
                    }
                } else {
                    state.list = state.list.filter(service => service.id !== id);
                }
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(saveVisibilityChange.fulfilled, (state, action) => {
                const { id, isVisible, mainServiceId } = action.payload;
                
                if (mainServiceId) {
                  // Update visibility for a sub-service
                  const mainService = state.list.find(service => service.id === mainServiceId);
                  if (mainService) {
                    const subService = mainService.subServices.find(sub => sub.id === id);
                    if (subService) {
                      subService.isVisible = isVisible;
                    }
                  }
                } else {
                  // Update visibility for a main service
                  const service = state.list.find(service => service.id === id);
                  if (service) {
                    service.isVisible = isVisible;
                  }
                }
              })
              .addCase(saveVisibilityChange.rejected, (state, action) => {
                state.error = action.payload;
              });
    },
});

export const { reorderServices } = servicesSlice.actions;
export default servicesSlice.reducer;
