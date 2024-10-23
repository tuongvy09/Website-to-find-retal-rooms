import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./authSlide";

export const store = configureStore({
    reducer:{
        auth: authReducer,
    }
});