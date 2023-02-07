const { verifyToken } = require("../Helpers/generateToken");
const { db } = require("../Conexiones/slq")


const checkRoleAuth = (roles) => async (req, res, next) => {
  try {
    console.log(roles)

    const token = req.headers.authorization.split(" ").pop();
    const tokenData = await verifyToken(token);
    // const userData = await userModel.findById(tokenData._id);//debo buscar con el id que para despues comparar

    db.query('select rr.rol_descripcion from seg_sis_rol_residente rr inner join seg_sis_residente r on r.rol_id=rr.rol_id  where per_id=$1', [tokenData._id], (error, results) => {
      if (error) {
        res.status(400).send(`Error`)
      } else {
        console.log(roles)
        if ([].concat(roles).includes(results.rows[0].rol_descripcion)) {
          next();
        } else {
          res.status(409).send(`{ "Error":"No rol"}`)
        }
      }

    })


  } catch (e) {
    res.status(409).send(`{ "Error":"No found"}`)
  }
};

module.exports = checkRoleAuth;
