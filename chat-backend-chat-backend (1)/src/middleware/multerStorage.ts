import path from "path";
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname, "../../dist/public"))
    },
    filename: (req, file, cb) => {
      console.log("file111",req.body.email)
      const ext = 'png';
      cb(null, `files/${req.body.email}.${ext}`);
    },
  });
  export const upload = multer({storage:storage})