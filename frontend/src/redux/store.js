import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlide";
import postReducer from "./postSlice";

export const store = configureStore({
    reducer:{
        auth: authReducer,
        posts: postReducer
    }
});