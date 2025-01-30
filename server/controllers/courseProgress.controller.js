import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";


// 1.
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // step-1 fetch the user course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId"); //dono ,course & userId Dono honi chahiye

    const courseDetails = await Course.findById(courseId).populate("lectures");//get course details , with lectures

    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }


    // If no details of course progress we get menas we not start this course till Now
    // Step-2 If no progress found, return course details with an empty progress
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    // Step-3 Return the user's course progress alog with course details
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
  }
};


// 2.
export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      // If no progress exist, create a new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    // now we have let courseProgress then in its lectureProgress we find lectureProgress
    // find the lecture progress in the course progress
    // we find te idx of lecture like (1,2,3,4)
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      // lectureProgress k andar lecture h & ech lecture hs it lectureId, & if its equal to outer lecturId
      (lecture) => lecture.lectureId === lectureId
    );

    if (lectureIndex !== -1) {
      // -1 menas we have get some lectureidx, if we get -1, means lecture is not inside the lectureProgress
      // if lecture already exist, update its status by that idx, & made its view = true
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      //else if we get -1, means we cant get the Lecture in lectureProgress so  Add new lecture progress,
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true, //aswe start the video means we made it true
      });
    }

    // if all lecture is complete
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed  //lectureprog is like i in loop, which iterate over every lectures in lectureProgress
      // if viewed = true for all lectures , menas we see it & using.length we get its length
    ).length;

    // if length of array of lecture progress is equal to the lectures length (like w ehave 4 lectores in lecture arrya in Coursein course array 
    // means we view all lecture, so mark course as completed

    const course = await Course.findById(courseId);

    if (course.lectures.length === lectureProgressLength)
      courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });

    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );//we make the evry lecture 's view as [viewd=true], so we say evry lecture is viewed 
    // then irrespective ofwe see all video or not, so course is copleted as its all lecture is completed
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({ message: "Course marked as completed." });
  } catch (error) {
    console.log(error);
  }
};


// 
export const markAsInCompleted = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.id;
  
      const courseProgress = await CourseProgress.findOne({ courseId, userId });
      if (!courseProgress)
        return res.status(404).json({ message: "Course progress not found" });
  
      courseProgress.lectureProgress.map(
        (lectureProgress) => (lectureProgress.viewed = false) //if we get ny lecture = false menas till now we cant mark course as completed
      );
      courseProgress.completed = false;
      await courseProgress.save();
      return res.status(200).json({ message: "Course marked as incompleted." });
    } catch (error) {
      console.log(error);
    }
  };