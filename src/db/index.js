import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(`${process.env.MONOGODB_URI}/${DB_NAME}`);
        console.log(`DB Connected :) ${db.connection.host}`);

    } catch (error) {
        console.log("DB Connection Error :(" ,error);
        throw (error)
    }
}

export default connectDB;