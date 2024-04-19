# Streamify

Streamify is an Express.js application that allows users to create, upload, view, like, and comment on videos, much like YouTube.

## Features

- **User Authentication:** Users can sign up for an account and log in securely.
- **Video Upload:** Upload videos directly to the platform.
- **Video Viewing:** Watch uploaded videos.
- **Like Videos:** Users can express their appreciation for videos by liking them.
- **Commenting:** Engage with other users through comments on videos.
- **Subscribe:** Users can subscribe to channels to stay updated with new content.


## Installation

To run Streamify locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies by running `npm install`.
4. Set up a MongoDB database and update the connection string.
5. Sign up for a Cloudinary account and obtain your cloud name, API key, and API secret.
6. Create a .env file in the root directory of the project and add the following variables:

MONGODB_URI=<your_mongodb_uri>
CORS_ORIGIN=<your_cors_origin>
ACCESS_TOKEN_SECRET=<your_access_token_secret>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

7. Start the server by running `npm run dev`.
8. Visit `http://localhost:8000` in your web browser.

## Usage

- **Sign Up:** Create a new account with a unique username and password.
- **Log In:** Log in to your account with your credentials.
- **Upload Video:** Once logged in, navigate to the upload page to add a new video.
- **View Videos:** Browse through the available videos on the homepage.
- **Like Videos:** Express your appreciation for videos by clicking the like button.
- **Comment:** Engage with other users by leaving comments on videos.

## Technologies Used

- **Express.js:** Backend framework for handling server logic.
- **MongoDB:** Database for storing user data and video information.
- **Mongoose:** MongoDB object modeling tool for Node.js.
- **JWT:** Authentication middleware for Node.js.
- **Multer:** Middleware for handling multipart/form-data, used for file uploads
- **Cloudinary:** Cloud storage for storing uploaded videos.


## Contributing

Contributions are welcome! Please fork this repository and create a pull request with your proposed changes.

## Contact

If you have any questions or suggestions, feel free to contact the project maintainer at [harshurao058@gmail.com](harshurao058@gmail.com).
