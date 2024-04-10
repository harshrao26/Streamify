import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema = new Schema({
    username: {
        type: String,
        requires: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        requires: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    avtar: {
        type: String,
        required: true
    },
    coverImg: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, {
    timestamps: true
})
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
export const User = mongoose.model('User', userSchema) 