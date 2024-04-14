import multer from "multer";

// Define storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temp");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


// Create Multer instance with the defined options
const upload = multer({ storage });

export default upload;
