import mongoose from "mongoose"

const lectureProgressSchema = new mongoose.Schema({
    lectureId:{type:String},  //kon sa lecture h
    viewed:{type:Boolean}  //menas are we watched video or not, pur alecture dekh liya ki nhi
});

const courseProgressSchema = new mongoose.Schema({
    userId:{type:String},   //which User is This
    courseId:{type:String},
    completed:{type:Boolean},  //is completed or not, if all lecture completed ,means lecture sare complete h so ourse completed h 
    lectureProgress:[lectureProgressSchema]  //lecture Progress:-
});

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);