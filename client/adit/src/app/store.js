import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
export const appStore = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer, // Add the API reducer here , // API reducer
        [courseApi.reducerPath]:courseApi.reducer,  //API Reducer
        [purchaseApi.reducerPath]:purchaseApi.reducer,
        [courseProgressApi.reducerPath]:courseProgressApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware()
      .concat(authApi.middleware)   // Add authApi middleware
      .concat(courseApi.middleware)  // Add courseAPI middleware // Correct the middleware setup
      .concat(purchaseApi.middleware)
      .concat(courseProgressApi.middleware)
}); 
// The middleware ensures that the authApi and courseApi requests are 
// properly handled and their responses are stored in the appropriate room in the Redux house (slices).


// Store Structure:- 

// const store = configureStore({
//   reducer: {
    // auth: authReducer,  // Use the reducer in the store
//   }
// });



// if regresh our user not get logout
const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
}
initializeApp();






/* 
Middleware are like helpers in the house who manage the flow of information. They handle tasks like logging actions, sending data to a server, or ensuring that specific rules are followed before an action is processed.

In the case of RTK Query (like authApi and courseApi), the middleware is needed to manage 
API requests and responses. For instance, when we want to load user data from a server, we send a request 
through the middleware, and the middleware ensures the data reaches the correct slice, 
updates the state, and keeps everything in sync

*/





/*
User interacts with UI (e.g., clicks the "Login" button).
Dispatch Action: The UI triggers a dispatch action (like userLoggedIn).
Action Sent to Store: The action is sent to the Redux store.
Reducer Handles Action: The action is sent to the correct slice in the store (e.g., authSlice), and the reducer updates the state accordingly.
Middleware Handles Async Requests: If the action involves async operations (like API calls), the middleware takes care of it (like authApi.middleware).
Updated State: The state in the Redux store is updated, and components re-render with the new state

*/