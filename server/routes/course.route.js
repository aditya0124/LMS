// import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { createCourse } from "../controllers/course.controller.js";
// import upload from "../utils/multer.js";
// const router = express.Router();

// router.route("/").post(isAuthenticated,createCourse);

// export default router;

import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCourse,createLecture,editCourse,editLecture,findAllCourses,getCourseById,getCourseLecture,getCreatorCourses, getLectureById, removeCourse, removeLecture, togglePublishCourse} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.route("/All").get(isAuthenticated,findAllCourses);
// router.route("/search").get(isAuthenticated, searchCourse);

router.route("/").post(isAuthenticated,createCourse);
router.route("/").get(isAuthenticated,getCreatorCourses);
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/course/:courseId").delete(isAuthenticated, removeCourse);


// Lecture AREA
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);


// CoursePublish
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);

// 

// router.route("/published-courses").get( isAuthenticated,getPublishedCourse);



export default router;