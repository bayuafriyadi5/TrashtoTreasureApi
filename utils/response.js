const response = (statusCode, data, message, res) => {
    res.status(statusCode).json({
        payload: data,
        status_code: statusCode,
        message: message,
        pagination: {
            prev: "",
            next: "",
            max: ""
        }
    });
};

module.exports = response;
