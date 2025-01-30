import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";


export const register = async(req,res) => {
    try {
        const{name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                sucess:false,
                message:"All fields are Required",
            })
        }
        // check the email is not already exits in DB
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                sucess:false,
                message:"User Already exists with this email",
            })
        }

        // hashed the password
        const hashedPassword = await bcrypt.hash(password,10);
// Create User
await User.create({
    name,
    email,
    password:hashedPassword,
});

return res.status(201).json ({
    success:true,
    message:"Account created Succesfully"
})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        })
    }
}



// LOGIN BLOCK
export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        // check user exists or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            });
        }
        generateToken(res, user, `Welcome back ${user.name}`);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to login"
        })
    }
}


// LogOut

export const logout = async(req,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({   //we delte the cookie(token) so we logout now fr the window, we here insert token to mpty as "", & maxage = 0;
            message:"Logged out successfully.",
            success:true
        })
     } 
     catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        })
    }
}


// get user profile
export const getUserProfile = async(req,res) => {
    try {
        // we first check that user is looged in or not
        // if not then we cant load his profile page
        // so we make a middleware named isAuthenticated in middlewre folder teel that user is authenticated or not
        // we get user Id from req.id in middleware is Authenticted, we save user id in the req.id
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("enrolledCourses"); //hume userId se password nhi chahiye so - that & we need enrolled courses so we need that
        // so we populate that
        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
     } 
     catch (error) {
        console.error("Error fetching profile:", error); // Log the error
        return res.status(500).json({
            success:false,
            message:"Failed to get user profile"
        })
    }
}


// WE use multer & clodinary for image uploading things

// UPDATE PROFILE
// export const updateProfile = async (req,res) => {
//     try {
//         const userId = req.id;  //get this UserData from isAuthenticaed middleware,
//         const {name} = req.body;  //this that we sendfrom the frontend to update our name
//         const profilePhoto = req.file;

//         const user = await User.findById(userId);
//         if(!user){
//             return res.status(404).json({
//                 message:"User not found",
//                 success:false
//             }) 
//         }


//         // UPDATED THE PROFILE HERE:- 

//         // use the clodinary for uploading image , in which we get a public link, to get img, so we extract that 

//         // for UPdate image we first delete the old photo then we  upload the new image
//         // so STEP 1. if photo exist we delte it using its public id
        
        
//         // extract public id of the old image from the url if it exists;
//         if(user.photoUrl){
//             const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
//             deleteMediaFromCloudinary(publicId);
//         }

//         // upload new photo
//         const cloudResponse = await uploadMedia(profilePhoto.path); //clodinary give us a response as a profile URL 
//         const photoUrl = cloudResponse.secure_url;

//         // here we have our updtaed Data
//         const updatedData = {name, photoUrl};

//         const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");
//         // new teue menas sari updated chije nayi dikhe,& we get the updtae user, but we didn't want password so - that 

//         return res.status(200).json({
//             success:true,
//             user:updatedUser,
//             message:"Profile updated successfully."
//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"Failed to update profile"
//         })
//     }
// }

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const userId = req.id; // Get user ID from authenticated middleware
        const { name } = req.body; // Get name from request body
        const profilePhoto = req.file; // Get uploaded photo from request (if any)

        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Store the fields that will be updated
        const updatedData = {};

        // If a new name is provided, update the name
        if (name) {
            updatedData.name = name;
        }

        // If a new profile photo is uploaded, update the photo
        if (profilePhoto) {
            // If the user already has a photo, delete it from Cloudinary
            if (user.photoUrl) {
                const publicId = user.photoUrl.split("/").pop().split(".")[0]; // Extract public id
                deleteMediaFromCloudinary(publicId); // Delete the old photo from Cloudinary
            }

            // Upload the new photo to Cloudinary
            const cloudResponse = await uploadMedia(profilePhoto.path);
            updatedData.photoUrl = cloudResponse.secure_url; // Get the new photo URL
        }

        // If no fields are provided to update, return an error
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                message: "No fields to update",
                success: false,
            });
        }

        // Update the user with the new data (name and/or photo)
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true })
            .select("-password"); // Exclude password from the response

        // Return success response with updated user
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully.",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};
