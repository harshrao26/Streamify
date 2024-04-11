import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cd(null, "./public/temp");
    },
    filename: (req, file, cb)=>{
        // const uniqueSuffix = Date.now() + '-' + Math.round
        cb(null,file.originalname)
    }
})

export const upload = multer({storage});