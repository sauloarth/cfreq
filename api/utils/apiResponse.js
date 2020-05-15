exports.sucessResponse = function (res, msg) {
    const payload = {
        status: 1,
        message: msg
    };
    return res.status(200).json(payload);
};

exports.sucessResponseWithData = function (res, msg, data) {
    const payload = {
        status: 1,
        message: msg,
        data: data
    }
    return res.status(200).json(payload)
};

exports.errorResponse = function (res, msg) {
    const payload = {
        status: 0,
        message: msg
    }
    return res.status(500).json(payload);
};

exports.notFoundResponse = function (res, msg) {
    const payload = {
        status: 0,
        message: msg
    }
    return res.status(404).json(payload);
};

exports.validationErrorWithData = function (res, msg, data) {
    const payload = {
        status: 0,
        message: msg,
        data: data
    }
    return res.status(400).json(payload)
};

exports.unauthorizedResponse = function (res, msg) {
    const payload = {
        status: 0,
        message: msg
    }
    return res.status(401).json(payload);
};