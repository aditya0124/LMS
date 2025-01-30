
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user/"

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include'
    }),
    endpoints: (builder) => ({
        // register user is a type of function.
        // builder.query is a query :- use when w ehave to fetch Data fro Api
        // builder.muation used when we have to post the data in API
        registerUser: builder.mutation({
            query: (inputData) => ({
                url:"register",   //in backend we see we do register on /register endpoint
                method:"POST",
                body:inputData //we see inputdata in server where w estore our data
            })
        }),

        loginUser: builder.mutation({
            query: (inputData) => ({
                url:"login",
                method:"POST",
                body:inputData
            }),
            // after login we dispatch the data 
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    console.log (result)
                    dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        // logout user

        logoutUser: builder.mutation({
            query: () => ({
                url:"logout",
                method:"GET"
            }),
            // clear store when we logged pout from there
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try { 
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        // get profile, we do get so use query
        loadUser: builder.query({
            query: () => ({
                url:"profile",
                method:"GET"
            }),
            //jab jab loaduser call hoga ye data bnaye rhega
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        updateUser: builder.mutation({
            query: (formData) => ({
                url:"profile/update",
                method:"PUT",
                body:formData,
                credentials:"include"
            })
        })
    })
});
export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation
} = authApi;


// in API we have a reducerPath, base query  & endpoints, 
// enpoints have builder as parameter which we use for data fetch, or for data post