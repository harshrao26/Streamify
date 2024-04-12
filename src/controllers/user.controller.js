import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/apiError.js '
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    console.log("Email: ", email)


    if ([fullName, email, password].includes('')) {
        throw new ApiError(400, 'All fields are required')
    }

    const exitedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (exitedUser) {

        throw new ApiError(409, 'User already exists')
    }
    const avatarFilePath = req.file?.avatar[0]?.path
    const coverImgFilePath  = req.file?.coverImg[0]?.path

    if(!avatarFilePath && !coverImgFilePath){
        throw new ApiError(400, 'Profile picture is required')
    }
});

export { registerUser };
