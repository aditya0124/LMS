import { Button } from "@/components/ui/button"
import Login from "./pages/login"
import Navbar from "./components/Navbar"
import HeroSection from "./pages/student/HeroSection"
// import Mainlayout from "./layout/Mainlayout"
import MainLayout from "./layout/Mainlayout"
import { createBrowserRouter } from "react-router-dom"
import { RouterProvider } from "react-router"
import Courses from "./pages/student/Courses"
import MyLearning from "./pages/student/MyLearning"
import Profile from "./pages/student/Profile"
import  Sidebar  from "./pages/admin/Sidebar"
import Course from "./pages/student/Course"
import Dashboard from "./pages/admin/Dashboard"
import CourseTable from "./pages/admin/course/CourseTable"
import AddCourse from "./pages/admin/course/AddCourse"
import EditCourse from "./pages/admin/course/EditCourse"
import CreateLecture from "./pages/admin/lecture/CreateLecture"
import EditLecture from "./pages/admin/lecture/EditLecture"
import CourseDetail from "./pages/student/CourseDetail"
import CourseProgress from "./pages/student/CourseProgress"
import SearchPage from "./pages/student/SearchPage"

import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";


// const appRouter = createBrowserRouter([
//   {
//     path:"/",
//     element:<Mainlayout/>,
//     children:[
//       {
//         path:"/",
//         element:(
//           <>
//           <HeroSection/>
//           <Courses />
//           </>
//         ),
        
//       },
//       {
//         path:"login",
//         element:<Login/>
//       },
//       {
//         path:"my-learning",
//         element:<MyLearning/>
//       },
//       {
//         path:"profile",
//         element:<Profile/>
//       },
//       {
//         path:"course/search",
//         element:<SearchPage/>
//       },
//       {
//         path: "course-detail/:courseId",
//         element: <CourseDetail />,
//       },
//       {
//         path: "course-progress/:courseId",
//         element:<CourseProgress/>,
//       },

//       // ADMIN ROUTES
//       {
//        path :"admin",
//        element:<Sidebar/>,
//        children:[
//         {
//           path:"dashboard",
//         element:<Dashboard/>
//         },

//         {
//          path:"course",
//          element:<CourseTable/>
//         },
//         {
//           path: "course/create",
//           element: <AddCourse />,
//         },
//         {
//           path: "course/:courseId",
//           element: <EditCourse />,
//         },



//         // Lecture Area
//         {
//           path: "course/:courseId/lecture",
//           element: <CreateLecture />,
//         },
//         {
//           path: "course/:courseId/lecture/:lectureId",
//           element: <EditLecture />,
//         },
//        ]
//       }
//     ],

//   },
// ]);

//  function App() {
//   return (
//     <main>
//       <RouterProvider router={appRouter}/>
//     </main>
//   )
// }
//  function App() {
//   return (
//     <main>
//       <RouterProvider router={appRouter}/>
//     </main>
//   )


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "my-learning",
        element: (
          <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-detail/:courseId",
        element: (
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
            <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },

      // admin routes start from here
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
      <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );

}

export default App;

// to render anything as a children we have to render them through Outlet