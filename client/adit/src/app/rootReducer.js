// import { combineReducers } from "@reduxjs/toolkit";
// import authReducer from "../features/authSlice"; 
// import { authApi } from "@/features/api/authApi";
// import { courseApi } from "@/features/api/courseApi";
// // import { purchaseApi } from "@/features/api/purchaseApi";
// // import { courseProgressApi } from "@/features/api/courseProgressApi";

// const rootRedcuer = combineReducers({
//     [authApi.reducerPath]:authApi.reducer,
//     [courseApi.reducerPath]:courseApi.reducer,
//     // [purchaseApi.reducerPath]:purchaseApi.reducer,
//     // [courseProgressApi.reducerPath]:courseProgressApi.reducer,
//     auth:authReducer, 
// });
// export default rootRedcuer;

// // we need the Middleware for thos hav to works

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"; // Auth reducer
import { authApi } from "@/features/api/authApi"; // API reducer
import { courseApi } from "@/features/api/courseApi"; // API reducer
import { purchaseApi } from "@/features/api/purchaseApi";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer, // This is how API reducers are included in the state
  [courseApi.reducerPath]: courseApi.reducer, // API reducer for courses
  [purchaseApi.reducerPath]:purchaseApi.reducer,
  auth: authReducer, // Auth slice reducer
});

export default rootReducer;