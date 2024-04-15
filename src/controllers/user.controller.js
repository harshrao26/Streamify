import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = User.findById({ userId });
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false
        });
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, 'Failed to generate access and refresh token');
    }
}
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
    if (req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0) {
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

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if ([username, password].some((field) => !field?.trim())) {
        throw new ApiError(400, 'All fields are required');
    }

    const user = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });
    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, 'Invalid credentials');
    }
    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);

    const loggedInUser = User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true, //accessible only by web server 
        secure: true   //https
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,
            {
                user: loggedInUser, accessToken, refreshToken
            },

            'Login successful')); //when user want to save cookies himself
}

)

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true //allowing you to access the most up-to-date information about the user without needing to perform an additional query.
    })

    const options = {
        httpOnly: true, //accessible only by web server 
        secure: true   //https
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, 'Logout successful')); //{} implies that you're not providing any specific data along with the response. This might be suitable if the logout operation does not require any additional data to be returned to the client, and the success message itself is sufficient


})

export { registerUser, loginUser, logoutUser };