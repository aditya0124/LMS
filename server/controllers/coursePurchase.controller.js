import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import  User  from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // a new object

// when we goes to a payment Section on App, then we have open a gateway to fill detials, then proceed to Buy, that called "Session"

// 1. Creating the Session
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId); //we find the Course
    if (!course) return res.status(404).json({ message: "Course not found!" });



    // Create a new course purchase record, 
    // means we create a CoursePurchase Schema, 
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      //we always find course Amt. from DB
      status: "pending",
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
    //   success URL means fter purchasing Course on which Page we have to redirect the User
      success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
      cancel_url: `http://localhost:5173/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });
// we get a URL when we Create a seeesion, so when we get the URL,we set paymentId of schema = sesssion Id
    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.log(error);
  }
};
// 2.  why we use stripe Webhook?. 
// ye btata h ki payment successful hua ki nhi
// we made this controller as we have to do in step 2 in stripe webhoooks
// this code we get from Stripe
export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
//   Menas Payment Succesfull, so now updtae Its status to completed
  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });
      // console.log("Purchased", purchase);

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
    //   now user ne Course purhase kr liya touske sare lectures ko ab unlok kar diy(isPreviewfreee = true)
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,  //find the userby Id that has Purchased the Course & add this courseId, to his Enrolled Courses
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,//find the course by its CourseId which the user has purchased & add the userId in Course's Schema at enrolled Students
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};
// 3..
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });
      // we have get the Courses
      //populae means where where we have a Courseid, lectreId, we get full collection of That id, in the array

      // Now check that user is Purchased This Course or Not, for everycourse Purchased with an Id, we have a ne collection, containing the course& yserId

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, //OR purchased?true:false // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

// 4.. Use this for getting All the Purchased Course from collection & we populate CourseId to get details of Courses
export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");  //populat emeans wwe get the that course Cshema with that courseId 
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const getInstructorCourse = async (_, res) => {
//   try {
//     const userID = req.id;
//     // const purchasedCourse = await CoursePurchase.find({
//     //   status: "completed",
//     // }).populate("courseId");  //populat emeans wwe get the that course Cshema with that courseId 
//     // if (!purchasedCourse) {
//     //   return res.status(404).json({
//     //     purchasedCourse: [],
//     //   });
//     // }
//     return res.status(200).json({
//       // purchasedCourse,
//       message:"Get user Id",
//     });
//     // returs
//   } catch (error) {
//     console.log(error);
//   }
// };
