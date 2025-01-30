// Server using express

import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js"
import cors from "cors";
import courseRoute from "./routes/course.route.js"
import mediaRoute from "./routes/media.route.js"
import purchaseRoute from "./routes/purchaseCourse.route.js"
import progressRoute from "./routes/courseProgress.route.js"
// import mongoose from "mongoose";
import { Course } from "./models/course.model.js";
import  User  from './models/user.model.js'; // Adjust path as needed
import isAuthenticated from "./middlewares/isAuthenticated.js";

dotenv.config({})

// connection to DB
connectDB();
const app = express();
const PORT = process.env.PORT || 3000

// apis:- use middleware,
// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));


// Search CurseAPI
app.get('/api/v1/course/search', async (req, res) => {
    try {
        const { query = "", categories = [], sortByPrice = "" } = req.query;

        // Create search query for courses
        const searchCriteria = {  //we atke a Object
            isPublished: true,  //menas we have search course that is Published
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },  //regex menas if w eget any word/char we are able to search that, in options i menas we search the char i
                { subTitle: { $regex: query, $options: "i" } },//if we get the char in subtitile or in courseTitle or in coursecategory we going to search the course 
                { category: { $regex: query, $options: "i" } },
            ],
        };

        // If categories are provided, add them to the search criteria
        if (categories.length > 0) {
            searchCriteria.category = { $in: categories };
        }

        // Sorting by price if specified
        const sortOptions = {};
        if (sortByPrice === "low") {
            sortOptions.coursePrice = 1; // Sort by price in ascending order
        } else if (sortByPrice === "high") {
            sortOptions.coursePrice = -1; // Sort by price in descending order
        }

        // Find courses matching the search criteria and sort them
        const courses = await Course.find(searchCriteria)
            .populate({ path: "creator", select: "name photoUrl" })
            .sort(sortOptions);

        res.status(200).json({
            success: true,
            courses: courses || [],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// APIs
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user",userRoute);  //wecrate an endpoint here
//with help of this our register route is like , so no can get it 
// "http://localhost:8080/api/v1/user/userRoute(like regster, login)"

// // API test
app.get("/home", (req,res) => {
    res.status(200).json({
        success:true,
        message:"Hello"
    })
})

app.use("/api/v1/course",courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", progressRoute);

//
app.listen(PORT, ()=> {
    console.log(`Server run at PORT ${PORT}`);
})
