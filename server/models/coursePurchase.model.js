import mongoose from "mongoose";
const coursePurchaseSchema = new mongoose.Schema({
    // We need the Course that we have Purchased
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    // we have need the which user Purchased which Course, or which user is purchased this Course
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    // Sttus,means is Purchase is completed or failed
    status:{
        type:String,
        enum:['pending', 'completed', 'failed'],
        default:'pending'
    },
    
    paymentId:{
        type:String,
        required:true
    }

},{timestamps:true});
export const CoursePurchase = mongoose.model('CoursePurchase', coursePurchaseSchema);

// we have made The Purchased Course,to see which is Purchased ciurse by whom we only fetch tilll now all course but not that which is purchased By that user