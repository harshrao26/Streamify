import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        // Await User.findById to get the user object
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Update user's refreshToken field
        user.refreshToken = refreshToken;

        // Save the user object
        await user.save({ validateBeforeSave: false });

        // Return tokens
        return { accessToken, refreshToken };

    } catch (error) {
        // Throw ApiError with appropriate status code and message
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
    const { email, username, password } = req.body; // Extracting email, username, and password from request body

    if ([username, password].some((field) => !field?.trim())) { // Checking if username or password is missing or empty
        throw new ApiError(400, 'All fields are required'); // Throwing an error if any field is missing or empty
    }

    const user = await User.findOne({ // Finding user by username or email
        $or: [{ username }, { email }]
    });
    if (!user) { // If user not found
        throw new ApiError(401, 'Invalid credentials'); // Throwing an error for invalid credentials
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password); // Checking if password is correct
    if (!isPasswordCorrect) { // If password is incorrect
        throw new ApiError(401, 'Invalid credentials'); // Throwing an error for invalid credentials
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id); // Generating access and refresh tokens

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken"); // Finding logged in user without password and refreshToken

    const options = { // Cookie options
        httpOnly: true, // Accessible only by web server 
        secure: true   // HTTPS 
    }

    return res // Sending response
        .status(200) // Setting status code to 200 (OK)
        .cookie("accessToken", accessToken, options) // Setting access token cookie
        .cookie("refreshToken", refreshToken, options) // Setting refresh token cookie
        .json(new ApiResponse(200, // Sending JSON response
            {
                user: loggedInUser, accessToken, refreshToken // Including logged in user, access token, and refresh token in response data
            },
            'Login successful')); // Success message
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true //allowing you to access the most up-to-date information about the user without needing to perform an additional query.
    })

    const options = {
        httpOnly: true, //  HTTP requests to the cookie will not be accessible only by web server 
        secure: true   // cookie should only be transmitted over secure HTTPS connections
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, 'Logout successful')); //{} implies that you're not providing any specific data along with the response. This might be suitable if the logout operation does not require any additional data to be returned to the client, and the success message itself is sufficient


})

const RefreshAccessToken = asyncHandler(async (req, res) => {
    const IncomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!IncomingRefreshToken) {
        throw new ApiError(400, 'Refresh token is required');
    }

    const decodedIncomingRefreshToken = jwt.verify(IncomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedIncomingRefreshToken?._id);
    if (!user) {
        throw new ApiError(400, 'User not found');
    }

    if (IncomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Invalid refresh token");

    }
})

const changePassword = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;

    const user = User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(400, "Invalid User")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json({ message: "Password changed" });

})

const getCurrentUser = asyncHandler(async (req, res) => {
        
})
export { registerUser, loginUser, logoutUser, RefreshAccessToken, changePassword };