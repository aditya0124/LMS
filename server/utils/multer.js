import multer from "multer";

const upload = multer({dest:"uploads/"});
export default upload;

//   /upload is destination folder or file where we save our image of users