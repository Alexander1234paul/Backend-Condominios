const { verifyToken } = require("../Helpers/generateToken");


const checkAuth = async (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ").pop();
    console.log(token)
    const tokenData = await verifyToken(token);
    console.log(tokenData)
    if (tokenData._id) {
      next();
    } else {
      res.status(409).send(`{"error":"Por aqui no pasa"}`)
    }
  } catch (e) {
    res.status(409).send(`{"error":"No tine exceso"}`)
  }
};

module.exports = checkAuth;
