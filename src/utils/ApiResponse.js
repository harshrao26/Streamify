class ApiResponse {
    constructor(statusCode, data, message) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message; // Removed the comma here
        this.success = statusCode < 400; // Fixed the typo in success property
    }
}

export default ApiResponse;
