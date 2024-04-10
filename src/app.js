import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import env from 'dotenv';
env.config({
    path: './.env'
})
const app = express()

app.use(express.json({
    limit: '16kb'
}))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))
app.use(express.static('public'))
app.use(cookieParser())

export default app;