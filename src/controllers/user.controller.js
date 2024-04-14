import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some((field) => !field?.trim())) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }
    console.log(req.files)

    const avatarFilePath = req.files?.avatar?.[0]?.path;
    // const coverImgFilePath = req.files?.coverImg?.[0]?.path;

    let coverImgFilePath 
    if(req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0) {
        coverImgFilePath = req.files.coverImg[0].path
    }

    if (!avatarFilePath) {
        throw new ApiError(400, 'Avatar is required');
    }

    const avatar = await uploadOnCloudinary(avatarFilePath);
    const coverImg = coverImgFilePath ? await uploadOnCloudinary(coverImgFilePath) : null;

    if (!avatar) {
        throw new ApiError(400, 'Failed to upload avatar');
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImg: coverImg?.url || ""
    });

    if (!user) {
        throw new ApiError(500, 'Failed to create user');
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res.status(201).json(new ApiResponse(200, createdUser, 'User created successfully'));
});

export { registerUser };
