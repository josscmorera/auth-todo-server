const { isEmpty } = require("validator");

const checkIfEmpty = (req, res, next) => {
    const errObj = {};

    for (let key in req.body) {
        if (isEmpty(req.body[key])) {
            errObj[key] = `${key} cannot be empty`;
        }
    }
    if (Object.keys(errObj).length > 0) {
        return res.status(400).json({ success: false, message: "error", errors: errObj });
    } else {
        next();
    }
}

module.exports = { checkIfEmpty };

