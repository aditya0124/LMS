import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  //Inside input we have all Field
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
// Get Params using params
  const params = useParams();
  const courseId = params.courseId;

 // const edit Course
 const [editCourse, { data, isLoading, isSuccess, error }] =
 useEditCourseMutation();
// get Course by Course Id;
  const { data: courseByIdData, isLoading: courseByIdLoading , refetch} =
  useGetCourseByIdQuery(courseId);

  const [publishCourse, {}] = usePublishCourseMutation();
 
  // Set the all input field in data to its previous Value,
  const course = courseByIdData?.course;

  useEffect(() => {
    // populate the course data
    // we get a course in data of getCourse by id:- so we extract that data
    if (courseByIdData?.course) { 
        const course = courseByIdData?.course;
        // now unki value k set kr denge jo ki hume previous se mil rhi h
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [course,courseByIdData]);
  // [course]: jab jab course hota h tab tab Fetch kro

  // when when we have a Courese id change

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();


 

    //handling functions 
    // 1. for input field like title,subtitle & decription only
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  // 2. for Select Category to set Data
  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  // for Select CourseLevel
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };
  
  // get file
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
    //   preview things of an imge
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };


  // we have input data ,so we have to change it to form data
//   Updtae Course handler
  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
//pass Data , now to the 
    await editCourse({ formData, courseId });
  };

//   Publish Handler:- 
  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({courseId, query:action});
      if(response.data){
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course");
    }
  }





  // Remove Course
  const [removeCourse,{data:removeData, isLoading:removeLoading, isSuccess:removeSuccess}] = useRemoveCourseMutation();
  const removeCourseHandler = async () => {
      // we send the lecture ID it delete the lecture
      await removeCourse(courseId);
    }
    // Toast Notification
    useEffect(()=>{
      if(removeSuccess){
        toast.success(removeData.message);
      }
    },[removeSuccess])
  
//   toast for remove
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course update.");
    }
    if (error) {
      toast.error(error.data.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  // Loader whenw e have load a course Details
  if(courseByIdLoading) return <h1>Loading...</h1>
 
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>

        <div className="space-x-2">
          <Button 
          disabled={courseByIdData?.course.lectures.length === 0}  // menas if we have no lecture we cant publish it, w emake diable for it, Atleast we hve lectures to upload it
          variant="outline" 
          onClick={()=> publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}
          >
            {/* courseByIdData?.course.isPublished ? "false" : "true") menas first get Course by Id then see its isPublished:- if its isPublished= false menas we till now won't publish course, so we click to publish it, menas ispublishe = false, then we have to make it true, means we have to make  it publish */}
            {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"}  
            {/* if our course is published , we show unpublish Btn, otheriwse we show publish button */}
          </Button>
          <Button disbaled={removeLoading} variant="destructive" onClick={removeCourseHandler}>
                      {
                        removeLoading ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Please wait
                        </> : "Remove Lecture"
                      }
                    </Button>
        </div>
      </CardHeader>


      {/* Card Content */}
      <CardContent>
        {/* Title Input */}
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack developer"
            />
          </div>
          {/* SubTitle Input */}
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
            />
          </div>

            {/* USe the Rich text Editor for the Description */}
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
            
            {/* Course category, Difficulty, Price */}
          <div className="flex items-center gap-5">
            {/* Category of Course using Select */}
            <div>
              <Label>Category</Label>
              <Select
                defaultValue={input.category}
                onValueChange={selectCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Course Level</Label>
              <Select
                defaultValue={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* Price Div */}
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>

          {/* thumbnail Course */}
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="e-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>

          {/* save button */}
          <div>
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>

            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;