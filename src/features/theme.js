import {createSlice} from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name: "theme", //name of the state
    initialState: { value: {
        background: "#202124",
        forground: "#171717",
        text: "#fff",
        button: "#e2e2e2",
    }}, 
    reducers: {
        loadTheme: (state, action) => {
            state.value = action.payload;
        },
        defaultTheme: (state) => {
            state.value = { value: {
                background: "#202124",
                forground: "#171717",
                text: "#fff",
                button: "#e2e2e2",
            }};
        }
    }
});

export const {loadTheme, defaultTheme} = themeSlice.actions;

export default themeSlice.reducer;