const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                next(err); // Pass the error to the error handling middleware
            });
    };
};

export default asyncHandler;
