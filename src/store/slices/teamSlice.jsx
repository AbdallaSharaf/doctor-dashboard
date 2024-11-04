import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../helpers/Axios';

// Async thunk for fetching team members
export const fetchTeamMembers = createAsyncThunk('teamMembers/fetch', async () => {
    const response = await axios.get('/teamMembers.json');
    const fetchedTeam = [];
    for (let key in response.data) {
        const member = { id: key, ...response.data[key] };
        if (member.name && member.job && member.description) {
            fetchedTeam.push(member);
        } else {
            await axios.delete(`/teamMembers/${key}.json`);
        }
    }
    fetchedTeam.sort((a, b) => a.order - b.order);
    return fetchedTeam;
});


// Define the async thunk to save the visibility change
export const saveVisibilityChange = createAsyncThunk(
  'team/saveVisibilityChange',
  async ({ id, isVisible }, { rejectWithValue }) => {
      try {
          // Check if the team member exists before updating
          const url = `/teamMembers/${id}.json`;
          const exists = await axios.get(url);

          if (!exists.data) {
              console.warn(`Team member with ID ${id} not found.`);
              return rejectWithValue(`Team member not found`);
          }

          // Proceed with updating visibility if it exists
          const response = await axios.patch(url, { isVisible });
          return { id, isVisible: response.data.isVisible };
      } catch (error) {
          console.error('Error updating visibility status:', error);
          return rejectWithValue(error.message);
      }
  }
);




// Async thunk for adding a new team member
export const addTeamMember = createAsyncThunk('teamMembers/add', async (newMember) => {
    const response = await axios.post('/teamMembers.json', newMember);
    return { id: response.data.name, ...newMember };
});

// Async thunk for editing a team member
export const editTeamMember = createAsyncThunk('teamMembers/edit', async (member) => {
    await axios.patch(`/teamMembers/${member.id}.json`, member);
    return member;
});

// Async thunk for deleting a team member
export const deleteTeamMember = createAsyncThunk('teamMembers/delete', async (id) => {
    await axios.delete(`/teamMembers/${id}.json`);
    return id;
});

export const saveMemberOrder = createAsyncThunk(
  'team/saveMemberOrder',
  async (members) => {
    await Promise.all(members.map((member, index) => 
      axios.patch(`/teamMembers/${member.id}.json`, { order: index })
    ));
  }
);

// Slice
const teamMembersSlice = createSlice({
    name: 'team',
    initialState: {
        members: [],
        loading: false,
        error: null,
    },
    reducers: {
        reorderTeamMembers: (state, action) => {
            const { dragIndex, hoverIndex } = action.payload;
            const updatedMembers = [...state.members];
            const [movedMember] = updatedMembers.splice(dragIndex, 1);
            updatedMembers.splice(hoverIndex, 0, movedMember);
            state.members = updatedMembers;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeamMembers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTeamMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(fetchTeamMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addTeamMember.fulfilled, (state, action) => {
                state.members.push(action.payload);
            })
            .addCase(editTeamMember.fulfilled, (state, action) => {
                const index = state.members.findIndex(member => member.id === action.payload.id);
                if (index !== -1) {
                    state.members[index] = action.payload;
                }
            })
            .addCase(deleteTeamMember.fulfilled, (state, action) => {
                state.members = state.members.filter(member => member.id !== action.payload);
            })
            .addCase(saveMemberOrder.rejected, (state, action) => {
                state.error = action.error.message; // Handle error
            })
            .addCase(saveVisibilityChange.fulfilled, (state, action) => {
              const { id, isVisible } = action.payload; // Destructure id and unread from payload
              const index = state.members.findIndex(member => member.id === id);
              if (index !== -1) {
                state.members[index].isVisible = isVisible; // Update the specific member in the state
              }
            })
            .addCase(saveVisibilityChange.rejected, (state, action) => {
              console.error(action.payload); // Handle error if needed
            });
    },
});

// Export actions and reducer
export const { reorderTeamMembers } = teamMembersSlice.actions;
export default teamMembersSlice.reducer;
