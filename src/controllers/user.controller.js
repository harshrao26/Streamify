import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some((field)=>field?.trim()==="")) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    const avatarFilePath = req.files?.avatar[0]?.path;
    // const coverImgFilePath = req.files?.coverImg[0]?.path;

    if (!avatarFilePath ) {
        throw new ApiError(400, 'Avatar is required');
    }

    const avatar = await uploadOnCloudinary(avatarFilePath);
    // const coverImage = await uploadOnCloudinary(coverImgFilePath);

    if (!avatar ) {
        throw new ApiError(500, 'Failed to upload images');
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        // coverImg: coverImage.url || ""
    });

    if (!user) {
        throw new ApiError(500, 'Failed to create user');
    }

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, 'Failed to retrieve created user');
    }

    return res.status(201).json(new ApiResponse(200, createdUser, 'User created successfully'));
});

export { registerUser };
