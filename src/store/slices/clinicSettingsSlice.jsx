import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../helpers/Axios';

// Async thunk for dynamically fetching options based on the endpoint
export const fetchOptions = createAsyncThunk(
  'clinicSettings/fetchOptions',
  async (endpoint, { rejectWithValue }) => {
    try {
      const response = await axios.get(`./settings/${endpoint}.json`);
      return {
        endpoint,
        data: response.data
          ? Object.keys(response.data).map((key) => ({
              id: key,
              name: response.data[key].name,
            }))
          : [],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting an option
export const deleteOption = createAsyncThunk(
  'clinicSettings/deleteOption',
  async ({ endpoint, id }, { rejectWithValue }) => {
    try {
      await axios.delete(`./settings/${endpoint}/${id}.json`);
      return { id, endpoint };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding an option
export const addOption = createAsyncThunk(
  'clinicSettings/addOption',
  async ({ endpoint, name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`./settings/${endpoint}.json`, { name });
      return { id: response.data.name, name, endpoint };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for editing an option
export const editOption = createAsyncThunk(
  'clinicSettings/editOption',
  async ({ endpoint, id, name }, { rejectWithValue }) => {
    try {
      await axios.patch(`./settings/${endpoint}/${id}.json`, { name });
      return { id, name, endpoint };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const clinicSettings = createSlice({
  name: 'clinicSettings',
  initialState: {
    diagnoses: [],
    jobs: [],
    medicines: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Combined fetchOptions action
      .addCase(fetchOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        const { endpoint, data } = action.payload;
        const key = endpoint.split('/').pop();
        state[key] = data;
        state.loading = false;
      })
      .addCase(fetchOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOption.fulfilled, (state, action) => {
        const { id, endpoint } = action.payload;
        const key = endpoint.split('/').pop();
        console.log(key)
        state[key] = state[key].filter((option) => option.id !== id);
      })
      .addCase(editOption.fulfilled, (state, action) => {
        const { id, name, endpoint } = action.payload;
        const key = endpoint.split('/').pop();
        const index = state[key].findIndex((option) => option.id === id);
        if (index !== -1) state[key][index].name = name;
      })
      .addCase(addOption.fulfilled, (state, action) => {
        const { id, name, endpoint } = action.payload;
        const key = endpoint.split('/').pop();
        state[key].push({ id, name });
      });
  },
});

export default clinicSettings.reducer;
