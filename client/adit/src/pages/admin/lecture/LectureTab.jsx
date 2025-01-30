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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);

// use this to show the prgressBar when we upload the Video
  const [mediaProgress, setMediaProgress] = useState(false);
// /value of how much % of media we uploaded
  const [uploadProgress, setUploadProgress] = useState(0);

  // btn.is not diable() when we upload the video
  const [btnDisable, setBtnDisable] = useState(true);

  const params = useParams();
  const { courseId, lectureId } = params;

  
  // ALL MUATATION
  const [edtiLecture, { data, isLoading, error, isSuccess }] =
  useEditLectureMutation();
  // In the editlecture , we have our updated Lecture in data;, now we use data for toast
  
const [removeLecture,{data:removeData, isLoading:removeLoading, isSuccess:removeSuccess}] = useRemoveLectureMutation();

// get the lecture by its ID, we get that lecture in "data:lectureData"
  const {data:lectureData} = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;  //get that into ecture 

  // set the pre data
  useEffect(()=>{
    if(lecture){
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo)
    }
  },[lecture])

    // handler for when we upload file
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData(); // take a form 
      formData.append("file", file); //add the file into form named "file"
      setMediaProgress(true);

      try {
        // EnD point of API :- MEDIA_API/upload-video;
        // now from that APIendPoint we get res as "data:result" & "sucess"
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          //this is we used for the showing the progress Bar
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        // as we get res like 
        // data :{sucess,data,message}
        // now if sucess = true
        if (res.data.success) {
          console.log(res);
          // set Video info 
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          // if all thing upload we say button now you are enable
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  //edit Lecture which send the Daata to Backend
  const editLectureHandler = async () => {
    console.log({ lectureTitle, uploadVideInfo, isFree, courseId, lectureId });

    await edtiLecture({
      lectureTitle,
      videoInfo:uploadVideInfo,
      isPreviewFree:isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    // we send the lecture ID it delete the lecture
    await removeLecture(lectureId);
  }


  // Toast Notification
  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(()=>{
    if(removeSuccess){
      toast.success(removeData.message);
    }
  },[removeSuccess])

  return (
    <div>
        <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button disbaled={removeLoading} variant="destructive" onClick={removeLectureHandler}>
            {
              removeLoading ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Please wait
              </> : "Remove Lecture"
            }
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            placeholder="Ex. Introduction to Javascript"
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
          <Label htmlFor="airplane-mode">Is this video FREE</Label>
        </div>
{/* use for showing the Progress Bar */}
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-4">
          <Button disabled={isLoading} onClick={editLectureHandler}>
              {
                isLoading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Please wait
                </> : "Update Lecture"
              }
            
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default LectureTab;



/*  
useGetLectureByIdQuery: Fetches the details of a specific lecture by lectureId to pre-fill the form for editing.

useEditLectureMutation: Sends a POST request to update the lecture with the new title, video info, and preview status (free or not).

useRemoveLectureMutation: Sends a request to delete the lecture by lectureId.

fileChangeHandler: Handles video file uploads, tracks progress, and updates the video info (URL and public ID) after a successful upload.

editLectureHandler: Calls useEditLectureMutation to update the lecture details with the current form data.

removeLectureHandler: Calls useRemoveLectureMutation to delete the lecture based on lectureId.


// from 102 we gwt 
courseId: "678e88df86af3b10e6ea36e9"

isFree: true
lectureId: "6791362293dca46f4f51944f"
lectureTitle: "Introduction to React"
uploadVideInfo{
publicId: "fdor6vdigvxwkqdzqdtv"
videoUrl: "http://res.cloudinary.com/dkss1z32z/video/upl
}


from 122

:- 
lecture: createdAt: "2025-01-22T18:17:06.097Z"
isPreviewFree:true
lectureTitle: "Introduction to React"
publicId: "fdor6vdigvxwkqdzqdtv"
updatedAt: "2025-01-23T17:54:34.500Z"
videoUrl: "http://res.cloudinary.com/dkss1z32z/video/upload/v1737654871/fdor6vdigvxwkqdzqdtv.mp4"
__v:0
_id: "6791362293dca46f4f51944f"
[[Prototype]]: Object
message: "Lecture updated successfully."



*/


