const jwt = require("jsonwebtoken");

const tokenSign = async (id, rol) => {
    return jwt.sign(
        {
            _id: id,
            role: rol,
        },
        "123456",
        {
            expiresIn: "24d",
        }
    );
};

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, "123456");
    } catch (e) {
        return null;
    }
};

const decodeSign = (token) => {
    return jwt.decode(token, null);
};

module.exports = { tokenSign, decodeSign, verifyToken };