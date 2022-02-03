import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user", //name of the state
    initialState: { value: false }, 
    reducers: {
        login: (state, action) => {
            state.value = action.payload;
        },
        logout: (state) => {
            state.value = false;
        }
    }
});

export const {login, logout} = userSlice.actions;

export default userSlice.reducer;