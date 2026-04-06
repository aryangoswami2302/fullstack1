import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

export const fetchMembers = createAsyncThunk('members/fetchMembers', async () => {
  return await api.getMembers();
});

export const addMember = createAsyncThunk('members/addMember', async (memberData) => {
  return await api.createMember(memberData);
});

export const updateMemberStatusAsync = createAsyncThunk('members/updateMemberStatus', async ({ id, status, member }) => {
  const updatedMember = { ...member, status };
  return await api.updateMember(id, updatedMember);
});

export const updateMemberAsync = createAsyncThunk('members/updateMember', async ({ id, member }) => {
  return await api.updateMember(id, member);
});

export const deleteMemberAsync = createAsyncThunk('members/deleteMember', async (id) => {
  await api.deleteMember(id);
  return id;
});

const membersSlice = createSlice({
  name: 'members',
  initialState: {
    list: [],
    filter: 'All', // 'All' | 'Active' | 'Inactive'
    loading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateMemberStatusAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateMemberAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteMemberAsync.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m.id !== action.payload);
      });
  }
});

export const { setFilter } = membersSlice.actions;
export default membersSlice.reducer;
