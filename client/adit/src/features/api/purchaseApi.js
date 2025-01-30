import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:8080/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    // 1. Create session
    createCheckoutSession: builder.mutation({
        query: (courseId) => ({
          url: "/checkout/create-checkout-session",
          method: "POST",
          body: { courseId },
        }),
      }),
    //   2.Get 
      getCourseDetailWithStatus: builder.query({
        query: (courseId) => ({
          url: `/course/${courseId}/detail-with-status`,
          method: "GET",
        }),
      }),
    //   3.
      getPurchasedCourses: builder.query({
        query: () => ({
          url: `/`,
          method: "GET",
        }),
      }),

      getInstructorCourse:builder.query({
        query:(userId) =>({
          url:'/instructor-course',
          method:"GET",
        }),
      })
    }),
  });

export const {
useCreateCheckoutSessionMutation,
useGetCourseDetailWithStatusQuery,
useGetPurchasedCoursesQuery,
} = purchaseApi;