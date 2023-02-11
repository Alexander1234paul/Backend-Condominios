
const { response } = require("express")
const { db } = require("../Conexiones/slq")
const { compare } = require("../Helpers/handleBcrypt")
const { tokenSign } = require("../Helpers/generateToken")
const nodemailer = require("nodemailer");

const loginCtrl = async (req, res) => {
    try {
        const { res_usuario, res_clave } = req.body
        // console.log(res_usuario, res_clave);

        db.query('select r.per_id, r.res_usuario, r.res_clave, rr.rol_descripcion from seg_sis_residente r inner join seg_sis_rol_residente rr on r.rol_id=rr.rol_id where res_usuario=$1', [res_usuario], async (error, results) => {
            if (results.rows == '') {
                res.status(200).send(`{"status":"Error", "resp":"Usuario no registrado"}`)
            } else {
                if (error) {
                    res.status(404).send(`{"status":"Error", "resp":"Error"}`)
                } else {
                    checkPassword = await compare(res_clave, results.rows[0].res_clave);
                    if (checkPassword) {

                        const token = await tokenSign(results.rows[0].per_id, results.rows[0].rol_descripcion);
                        // response.status.send(data)
                        res.status(200).send(`{"status":"OK", "token":"${token}"}`)

                    } else {
                        res.status(200).send(`{"status":"Error", "resp":"Contaseña incorrecta"}`)
                    }
                }
            }

        })
    } catch (error) {
        res.status(404).send(`{"status":"Error", "resp":"Error"}`)
    }



}

const sendEmail = async (req, res) => {

    const { emailDestino, Datos } = req.body

    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'paul1234alexander@gmail.com', // generated ethereal user
            pass: 'jpizrpzbkmlbxwiz' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }

    }

    const mensaje = {
        from: 'paul1234alexander@gmail.com', // sender address
        to: emailDestino, // list of receivers
        subject: 'COMPROBANTE', // Subject line
        text: Datos, // plain text body
        // html: '<p>HTML content</p>' // html body
    };


    const transporter = nodemailer.createTransport(config);

    transporter.sendMail(mensaje, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
    // const info = await transporter.sendMail(mensaje);


    // console.log(info)
    res.status(200).send(`{"status":"Error", "resp":"Error"}`)
}

module.exports = {
    loginCtrl, sendEmail

}