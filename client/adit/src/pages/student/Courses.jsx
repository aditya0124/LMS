
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetAllCourseQuery } from "@/features/api/courseApi";
import { useSelector } from "react-redux";
 
const Courses = () => {
  const{data,isError,isLoading,isSuccess}=useGetAllCourseQuery();
  // if(isSuccess){
  //   alert("All OK");
  // }

  // 
  const { isAuthenticated } = useSelector((state) => state.auth); // Get the auth state from Redux

  // if (!isAuthenticated) {
  //   return <h1>Please log in to view courses.</h1>;
  // }

  if (!isAuthenticated) {
    return (
      <div className="absolute inset-0 flex justify-center items-center bg-gray-50 dark:bg-[#141414]">
        <h1 className="text-4xl font-bold text-center text-red-600 dark:text-red-400">
          Please log in to view courses.
        </h1>
      </div>
    );
  }
  
  
  // 
  console.log(data);
//  const isLoading = false;
  if(isError) return <h1>Some error occurred while fetching courses.</h1>
const courses = [1,2,3,4,5];
  return (
    <div className="bg-gray-50 dark:bg-[#141414]">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* if is loading true menas we load page then we display the skeleton othrwise we direct show them course card */}
          {isLoading ? (
            // 8 bar skeleton Diaplay krne k liye humne array.map use kiya h
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : 
          // (
          //   courses.map((course,index) => <Course key={index} course={course}/>)
          // )
          (
            // if Data have Courses then we map on courses of data
           data?.courses && data.courses.map((course, index) => <Course key={index} course={course}/>) 
          )
          // <Course/>
          }
         
        </div>
      </div>
    </div>
  );
};

export default Courses;


// it is skelton which we see any any Page load so we see theor card skeleton
const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};


// import { Skeleton } from "@/components/ui/skeleton";
// import React from "react";
// import Course from "./Course";
// // import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
 
// const Courses = () => {
//   // const {data, isLoading, isError} = useGetPublishedCourseQuery();
 
//   // if(isError) return <h1>Some error occurred while fetching courses.</h1>
//   const isLoading = false;

//   const courses = [1,2,3,4,5];

//   return (
//     <div className="bg-gray-50 dark:bg-[#141414]">
//       <div className="max-w-7xl mx-auto p-6">
//         <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {isLoading ? (
//             Array.from({ length: 8 }).map((_, index) => (
//               <CourseSkeleton key={index} />
//             ))
//           ) : (
//           //  data?.courses && data.courses.map((course, index) => <Course key={index} course={course}/>) 
//           courses.map((course,index) => <Course key={index} course={course}/>)
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Courses;

// const CourseSkeleton = () => {
//   return (
//     <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
//       <Skeleton className="w-full h-36" />
//       <div className="px-5 py-4 space-y-3">
//         <Skeleton className="h-6 w-3/4" />
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Skeleton className="h-6 w-6 rounded-full" />
//             <Skeleton className="h-4 w-20" />
//           </div>
//           <Skeleton className="h-4 w-16" />
//         </div>
//         <Skeleton className="h-4 w-1/4" />
//       </div>
//     </div>
//   );
// };