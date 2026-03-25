import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// READ
export const readUser = createAsyncThunk(
    'readUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("http://localhost:3000/users");
            return res.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// ADD
export const adddata = createAsyncThunk(
    'adddata',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post("http://localhost:3000/users", data);
            return res.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// DELETE
export const deleteUser = createAsyncThunk(
    'deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
// edit
export const updatedata = createAsyncThunk(
    'updatedata', async (data, { rejectWithValue }) => {
        try {
            const res = await axios.put(`http://localhost:3000/users/${data.id}`, data)
            const result = await res.data
            return result;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

export const userSlice = createSlice({
    name: "userDetails",
    initialState: {
        loading: false,
        users: [],
        error: ""
    },

    // ❌ REMOVE old reducers (important)
    reducers: {},

    extraReducers: (builder) => {
        builder

            // READ
            .addCase(readUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(readUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(readUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ADD
            .addCase(adddata.pending, (state) => {
                state.loading = true;
            })
            .addCase(adddata.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(adddata.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ DELETE (FIXED)
            .addCase(deleteUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(
                    (user) => user.id !== action.payload
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ✅ UPDATE (EDIT)
            .addCase(updatedata.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatedata.fulfilled, (state, action) => {
                state.loading = false;

                state.users = state.users.map((user) =>
                    user.id === action.payload.id ? action.payload : user
                );
            })
            .addCase(updatedata.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    }
});

export default userSlice.reducer;