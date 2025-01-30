 
// import { Course } from "../models/course.model.js";
// import { Lecture } from "../models/lecture.model.js";
// import {deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia} from "../utils/cloudinary.js";

// export const createCourse = async (req,res) => {
//     try {
//         const {courseTitle, category} = req.body;
//         if(!courseTitle || !category) {
//             return res.status(400).json({
//                 message:"Course title and category is required."
//             })
//         }

//         const course = await Course.create({
//             courseTitle,
//             category,
//             creator:req.id
//         });

//         return res.status(201).json({
//             course,
//             message:"Course created."
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to create course"
//         })
//     }
// }
// // 2. get creator Course
// export const getCreatorCourses = async (req,res) => {
//     try {
//         const userId = req.id;
//         // find course on creator Id(or say UserId,as user is the Craetor) in the Course Collection in DB
//         const courses = await Course.find({creator:userId});
//         if(!courses){
//             return res.status(404).json({
//                 courses:[],
//                 message:"Course not found"
//             })
//         };
//         return res.status(200).json({
//             courses,
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to get course"
//         })
//     }
// }

// // 3. EDit Course
// export const editCourse = async (req,res) => {
//     try {
//         const courseId = req.params.courseId;
//         const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
//         const thumbnail = req.file;

//         let course = await Course.findById(courseId);
//         if(!course){
//             return res.status(404).json({
//                 message:"Course not found!"
//             })
//         }
//         // delete the ol thumbnail
//         let courseThumbnail;
//         if(thumbnail){
//             if(course.courseThumbnail){ ///if the course has any previous Thumbnail elete it
//                 console.log("Thumbnail URL:-", course.courseThumbnail);
                
//                 const publicId = course.courseThumbnail.split("/").pop().split(".")[0]; //extract public Id
//                 await deleteMediaFromCloudinary(publicId); // delete old image
                
//                 console.log("public Id", publicId);
//             }
//             // upload a thumbnail on clourdinary
//             courseThumbnail = await uploadMedia(thumbnail.path);
//             console.log("new course Path", courseThumbnail);
//         }

 
//         const updateData = {courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail:courseThumbnail?.secure_url};
//         // courseThumbnail:courseThumbnail?.secure_url means whenw e upload our media to clof=dinary we get a Secure URL in return , which is new path to media, so we assign coursethumbnail to this secureURL;

//         course = await Course.findByIdAndUpdate(courseId, updateData, {new:true});

//         return res.status(200).json({
//             course,
//             message:"Course updated successfully."
//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to create course"
//         })
//     }
// }

// // 4. by getting Get Course By Id,so when we open to edit Course, we populate its Old data
// export const getCourseById = async (req,res) => {
//     try {
//         const {courseId} = req.params;

//         const course = await Course.findById(courseId);

//         if(!course){
//             return res.status(404).json({
//                 message:"Course not found!"
//             })
//         }
//         // get Course
//         return res.status(200).json({
//             course
//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to get course by id"
//         })
//     }
// }


// // Lecture Area
// export const createLecture = async (req,res) => {
//     try {
//         const {lectureTitle} = req.body;
//         const {courseId} = req.params;

//         if(!lectureTitle || !courseId){
//             return res.status(400).json({
//                 message:"Lecture title is required"
//             })
//         };

//         // create lecture
//         const lecture = await Lecture.create({lectureTitle});

//         const course = await Course.findById(courseId);
//         if(course){
//             course.lectures.push(lecture._id); // Push the Lectures info into its belonging Course
//             await course.save();
//         }

//         return res.status(201).json({
//             lecture,
//             message:"Lecture created successfully."
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to create lecture"
//         })
//     }
// }
// export const getCourseLecture = async (req,res) => {
//     try {
//         const {courseId} = req.params;
//         const course = await Course.findById(courseId)
//         .populate("lectures");  // find courses then we populate menas we goes in "lectures" array of a particular Course,
//         // so we first find that Course the it slectures
//         console.log(course.lectures);  // Log to check if lectureTitle exists

//         if(!course){
//             return res.status(404).json({
//                 message:"Course not found"
//             })
//         }
//         // we return the lectures array,which is the course.lectures array
//         return res.status(200).json({
//             lectures: course.lectures
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to get lectures"
//         })
//     }
// }

// export const removeCourse = async (req,res) => {
//     try {
//         const {courseId} = req.params;
//         const course = await Course.findByIdAndDelete(courseId);
//         if(!course){
//             return res.status(404).json({
//                 message:"Course not found!"
//             });
//         }
//         return res.status(200).json({
//             message:"Course removed successfully."
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to remove lecture"
//         })
//     }
// }

// // 
// export const editLecture = async (req,res) => {
//     try {
//         // we have vieo url & it spublic Id in VideoInfo
//         const {lectureTitle, videoInfo, isPreviewFree} = req.body;
        
//         const {courseId, lectureId} = req.params;
//         const lecture = await Lecture.findById(lectureId);
//         if(!lecture){
//             return res.status(404).json({
//                 message:"Lecture not found!"
//             })
//         }

//         // update lecture
//         if(lectureTitle) lecture.lectureTitle = lectureTitle;  //if we have get a lectureTitle from the frontend update the lecture title in lectureModel
//         if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
//         if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
//         lecture.isPreviewFree = isPreviewFree;

//         await lecture.save();

//         // Ensure the course still has the lecture id if it was not aleardy added;
//         const course = await Course.findById(courseId);
//         // we get the lecture at 259, so we have see i that lectur eis in that cours eor not, if the lecture doesn't exist(by some cause) in that course we again add it
//         if(course && !course.lectures.includes(lecture._id)){
//             course.lectures.push(lecture._id);
//             await course.save();
//         };
//         return res.status(200).json({
//             lecture,
//             message:"Lecture updated successfully."
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to edit lectures"
//         })
//     }
// }
// export const removeLecture = async (req,res) => {
//     try {
//         const {lectureId} = req.params;
//         const lecture = await Lecture.findByIdAndDelete(lectureId);
//         if(!lecture){
//             return res.status(404).json({
//                 message:"Lecture not found!"
//             });
//         }
//         // delete the lecture from couldinary as well
//         if(lecture.publicId){
//             await deleteVideoFromCloudinary(lecture.publicId);
//         }

//         // Remove the lecture reference from the associated course
//         await Course.updateOne(  //we search in Course Collection that contain that lectue
//             {lectures:lectureId}, // find the course that contains the lecture,
//             {$pull:{lectures:lectureId}} // Remove the lectures id from the lectures array
//         );

//         return res.status(200).json({
//             message:"Lecture removed successfully."
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to remove lecture"
//         })
//     }
// }
// export const getLectureById = async (req,res) => {
//     try {
//         const {lectureId} = req.params;
//         const lecture = await Lecture.findById(lectureId);
//         if(!lecture){
//             return res.status(404).json({
//                 message:"Lecture not found!"
//             });
//         }
//         return res.status(200).json({
//             lecture,
//             message:"Lecture  found!"
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to get lecture by id"
//         })
//     }
// }


// // publich unpublish course logic
// //if we have course we publish(menas Site par dal diya),or if it is already published then  we unpublish it 
// export const togglePublishCourse = async (req,res) => {
//     try {
//         const {courseId} = req.params;
//         const {publish} = req.query; // true, false
//         // agar hum publish krr he h to true aayega, otherwise False aayega
//         const course = await Course.findById(courseId);
//         if(!course){
//             return res.status(404).json({
//                 message:"Course not found!"
//             });
//         }
//         // publish status based on the query paramter
//         course.isPublished = publish === "true"; //means we set update isPublised in our Variable        
//         await course.save();

//         const statusMessage = course.isPublished ? "Published" : "Unpublished";
//         return res.status(200).json({
//             message:`Course is ${statusMessage}`
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to update status"
//         })
//     }
// }



// // Get Published Course
// export const getPublishedCourse = async (_,res) => {
//     try {
//         const courses = await Course.find({isPublished:true})
//         .populate({path:"creator", select:"name photoUrl"});  // this Line means as we have also want tto get Creator Name & their DP, so we fetch information of creator usign poplate & slect its name, profile
//         if(!courses){
//             return res.status(404).json({
//                 message:"Course not found"
//             })
//         }
//         return res.status(200).json({
//             courses,
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message:"Failed to get published courses"
//         })
//     }
// }


// // Serach Course
// export const searchCourse = async (req,res) => {
//         try {
//             const {query = "", categories = [], sortByPrice =""} = req.query;
//             console.log(categories);
            
//             // create search query
//             const searchCriteria = {
//                 isPublished:true,
//                 $or:[
//                     {courseTitle: {$regex:query, $options:"i"}},
//                     {subTitle: {$regex:query, $options:"i"}},
//                     {category: {$regex:query, $options:"i"}},
//                 ]
//             }
    
//             // if categories selected
//             if(categories.length > 0) {
//                 searchCriteria.category = {$in: categories};
//             }
    
//             // define sorting order
//             const sortOptions = {};
//             if(sortByPrice === "low"){
//                 sortOptions.coursePrice = 1;//sort by price in ascending
//             }else if(sortByPrice === "high"){
//                 sortOptions.coursePrice = -1; // descending
//             }
    
//             let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);
    
//             return res.status(200).json({
//                 success:true,
//                 courses: courses || []
//             });
    
//         } catch (error) {
//             console.log(error);
            
//         }
//     }




 
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia} from "../utils/cloudinary.js";


export const createCourse = async (req,res) => {
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category) {
            return res.status(400).json({
                message:"Course title and category is required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator:req.id
        });

        return res.status(201).json({
            course,
            message:"Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}

// export const searchCourse = async (req,res) => {
//     try {
//         const {query = "", categories = [], sortByPrice =""} = req.query;
//         console.log(categories);
        
//         // create search query
//         const searchCriteria = {
//             isPublished:true,
//             $or:[
//                 {courseTitle: {$regex:query, $options:"i"}},
//                 {subTitle: {$regex:query, $options:"i"}},
//                 {category: {$regex:query, $options:"i"}},
//             ]
//         }

//         // if categories selected
//         if(categories.length > 0) {
//             searchCriteria.category = {$in: categories};
//         }

//         // define sorting order
//         const sortOptions = {};
//         if(sortByPrice === "low"){
//             sortOptions.coursePrice = 1;//sort by price in ascending
//         }else if(sortByPrice === "high"){
//             sortOptions.coursePrice = -1; // descending
//         }

//         let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

//         return res.status(200).json({
//             success:true,
//             courses: courses || []
//         });

//     } catch (error) {
//         console.log(error);
        
//     }
// }
export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId});
        if(!courses){
            return res.status(404).json({
                courses:[],
                message:"Course not found"
            })
        };
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}
export const editCourse = async (req,res) => {
    try {
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // delete old image
            }
            // upload a thumbnail on clourdinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

 
        const updateData = {courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail:courseThumbnail?.secure_url};

        course = await Course.findByIdAndUpdate(courseId, updateData, {new:true});

        return res.status(200).json({
            course,
            message:"Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}
export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course by id"
        })
    }
}

export const createLecture = async (req,res) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        };

        // create lecture
        const lecture = await Lecture.create({lectureTitle});

        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message:"Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create lecture"
        })
    }
}
export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lectures"
        })
    }
}
export const editLecture = async (req,res) => {
    try {
        const {lectureTitle, videoInfo, isPreviewFree} = req.body;
        
        const {courseId, lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }

        // update lecture
        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        // Ensure the course still has the lecture id if it was not aleardy added;
        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message:"Lecture updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit lectures"
        })
    }
}
export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures:lectureId}, // find the course that contains the lecture
            {$pull:{lectures:lectureId}} // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message:"Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}
export const getLectureById = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture by id"
        })
    }
}


// publich unpublish course logic

export const togglePublishCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // true, false
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            });
        }
        // publish status based on the query paramter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message:`Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}


export const removeCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findByIdAndDelete(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            });
        }
        return res.status(200).json({
            message:"Course removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}

// to getting the Published Courses
export const findAllCourses = async (req,res) => {

    const courses = await Course.find({isPublished:true})
    .populate({path:"creator", select:"name photoUrl"});
    console.log(courses);
    if(!courses){
        return res.status(404).json({
            message:"Course not found"
        })
    }
    return res.status(200).json({
        courses,
    })
}

