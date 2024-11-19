import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../helpers/Axios';

// Thunk for fetching messages
export const fetchMessages = createAsyncThunk('messages/fetchMessages', async () => {
    const response = await axios.get('/messages.json');
    return response.data? Object.keys(response.data).map((key) => ({
        id: key,
        ...response.data[key]
      }))
    : []; // Ensure this matches your API response structure
});

// Thunk for marking a message as unread
export const markAsUnread = createAsyncThunk(
    'messages/markAsUnread', 
    async ({ id, unread }) => {
        try {
            console.log(id)
            const response = await axios.patch(`/messages/${id}.json`, { unread });
            return { id, unread: response.data.unread }; // Include id with the updated unread status
        } catch (error) {
            console.error('Error updating message status:', error);
            throw error; // Ensure the error is caught by createAsyncThunk's rejected state
        }
    }
);


// Thunk for deleting a message
export const deleteMessage = createAsyncThunk('messages/deleteMessage', async (id) => {
    
    await axios.delete(`/messages/${id}.json`);
    return id;
});

const messages = createSlice({
    name: 'messages',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error on new fetch
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Set messages data
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Capture error message
            })
            .addCase(markAsUnread.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error on new fetch
            })
            .addCase(markAsUnread.fulfilled, (state, action) => {
                const { id, unread } = action.payload; // Destructure id and unread from payload
                const message = state.data.find((msg) => msg.id === id);
                if (message) {
                    message.unread = unread;
                }
                state.loading = false;
            })
            .addCase(markAsUnread.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Capture error message
            })
            .addCase(deleteMessage.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error on new fetch
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                const id = action.payload;
                state.data = state.data.filter(msg => msg.id !== id); // Remove deleted message
                state.loading = false;
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Capture error message
            })
    },
});

// Export actions if you add any synchronous actions
export default messages.reducer;
