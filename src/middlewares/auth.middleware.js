import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers('Authorization').replace('Bearer ', ''); //the access token is stored (cookies or headers), it will be retrieved and stored in the token variable for further use

        if (!token) {
            throw new ApiError(401, 'Unauthorized');
        }

        const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //verify the access token with the access token secret ------- iss line me jo token generate hua hi usse .env se match kra k decode karte h

        const user = await User.findById(decodedUser?._id).select("-password -refreshToken")  //Access the _id property of the decodedUser object

        if (!user) {
            throw new ApiError(401, 'Invalid Access Token');
        }
        req.user = user //attaching the user object to the request object to provide access to user information throughout the application.
        next()
    } catch (error) {
        throw new ApiError(401, 'Invalid Access Token');
    }


})
export default verifyJWT