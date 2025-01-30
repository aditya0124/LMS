import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],  //these tag are helpful in re-fetching the courses 
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({

    // 1.createCourse
    // as this is POST, so mutation, query only in case of GET
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"], //give tags so it refetch the course
    }),

// get SearchCourse
getSearchCourse:builder.query({
  query: ({searchQuery, categories, sortByPrice}) => {
    // Build query string
    let queryString = `/search?query=${encodeURIComponent(searchQuery)}`

    // append cateogry 
    if(categories && categories.length > 0) {
      const categoriesString = categories.map(encodeURIComponent).join(",");
      queryString += `&categories=${categoriesString}`; 
    }

    // Append sortByPrice is available
    if(sortByPrice){
      queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`; 
    }

    return {
      url:queryString,
      method:"GET", 
    }
  }
}),

    getAllCourse: builder.query({
      query: () => ({
        url: "/All",
        method: "GET"
      }),
    }),

    // 2.get creator course
    getCreatorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],  //it re-fetch the courses 
    }),


// 3.Edit Course  //we Send Data so we use mutation
editCourse: builder.mutation({
  query: ({ formData, courseId }) => ({
    url: `/${courseId}`,
    method: "PUT",
    body: formData,
  }),
  invalidatesTags: ["Refetch_Creator_Course"],
}),

// 4. get Course By Id
getCourseById: builder.query({
  query: (courseId) => ({
    url: `/${courseId}`,
    method: "GET",
  }),
}),

removeCourse: builder.mutation({
  query: (courseId) => ({
    url: `/course/${courseId}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Refetch_Creator_Course"],
}),

// Publish Course
publishCourse: builder.mutation({
  query: ({ courseId, query }) => ({
    url: `/${courseId}?publish=${query}`,
    method: "PATCH",
    // qury m true ya false hoga
  }),
}),

    // Lecture AREA
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
    }),

    // 2.
    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Lecture"],
    }),

    // 3.we have want courseId, & lectureId as we need  provide that route which include {ids}in backend
    editLecture: builder.mutation({
      // The argument passed to query contains the variables that you need for the request. This could be values like the lectureTitle, videoInfo, isPreviewFree, courseId, and lectureId needed to build the request dynamically.
      // The argument passed into the query function contains dynamic data that you want to send with the request.
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        courseId,
        lectureId,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree }, 
        //You're sending a POST request with the following data in the body:
      }),
    }),

// 4.
    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lecture"],
    }),
    // 5.get by Id
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
    }),
    
  }),
});
export const {
  useCreateCourseMutation,
  useGetSearchCourseQuery,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation,
  useGetAllCourseQuery,
} = courseApi;

// For RTK QUERY we have to also add middleware for this in reducer