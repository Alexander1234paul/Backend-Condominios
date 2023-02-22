const express = require("express");
const Img = require("../models/img");
const { db } = require("../Conexiones/slq")
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const UUID = require('uuid-int');
const { ObjectId } = require('mongodb');




const {
    uploadToCloudinary,
    removeFromCloudinary,
} = require("../services/cloudinary");


const getImg = async(req, res) => {
    const img = await Img.find()
    res.json(img)
}

const createImg = async(req, res) => {
    try {
        // Upload image to cloudinary
        const data = await uploadToCloudinary(req.file.path, "condominio");
        const imageUrl = data.url;

        // Create new image object
        let img = new Img({
            name: req.body.name,
            imageUrl: imageUrl,
            publicId: data.public_id,
        });

        // Save image to MongoDB
        await img.save();

        // Insert image URL and ser_id to PostgreSQL
        const query = 'INSERT INTO res_detalle_servicio (dser_evidencia, ser_id,id_mongo) VALUES ($1, $2,$3)';
        const values = [imageUrl, req.body.ser_id, img._id];
        await db.query(query, values);
        res.send(`{"status":"Ok", "resp":"Asignación correcta"}`)
    } catch (err) {
        console.log(err);
        res.send(`{"status":"Error", "resp":${err}}`)
    }
};



// Delete img Image
const deleteImg = async(req, res) => {
    const objectId = mongoose.Types.ObjectId(req.params.id);

    try {
        // Find user by id
        let img = await Img.findOne({ _id: objectId });
        const publicId = img.publicId;
        // Delete image from cloudinary
        await removeFromCloudinary(publicId);
        // Delete user from db
        await img.remove();
        res.json(img);
    } catch (err) {
        console.log(err);
    }
};



// const updateImg = async(req, res) => {
//     try {
//         //Upload Image to Cloudinary
//         let img = await Img.findOne({ _id: req.params.id });
//         const publicId = img.publicId;
//         // Delete image from cloudinary
//         await removeFromCloudinary(publicId);
//         const data = await uploadToCloudinary(req.file.path, "condominio");
//         //Save Image Url and publiId ti the database
//         const savedImg = await Img.updateOne({ _id: req.params.id }, {
//             $set: {
//                 name: data.name,
//                 imageUrl: data.url,
//                 publicId: data.public_id,
//             },
//         });

//         res.status(200).send("user image uploaded with success!");
//     } catch (error) {
//         res.status(400).send(error);
//     }
// };
// const updateImg = async(req, res) => {
//     try {
//         const _id = request.params.tser_id;

//         // Query PostgreSQL to get id_mongo for the given id
//         const result = await db.query(
//             'SELECT id_mongo FROM res_detalle_servicio WHERE dser_id = $1', [_id]
//         );
//         const id_mongo = result.rows[0].id_mongo;
//         const idM = new ObjectId(id_mongo.slice(1, -1));

//         //Upload Image to Cloudinary
//         let img = await Img.findOne({ _id: idM });
//         const publicId = img.publicId;
//         // Delete image from cloudinary
//         await removeFromCloudinary(publicId);
//         const data = await uploadToCloudinary(req.file.path, "condominio");
//         //Save Image Url and publiId ti the database
//         const savedImg = await Img.updateOne({ _id: id_mongo }, {
//             $set: {
//                 name: data.name,
//                 imageUrl: data.url,
//                 publicId: data.public_id,
//             },
//         });
//         res.send(`{"status":"Ok", "resp":"user image uploaded with success!"}`)

//     } catch (error) {
//         res.send(`{"status":"Error", "resp":${error}}`)
//     }
// };
const updateImg = async(req, res) => {
    try {
        // Upload image to cloudinary
        const data = await uploadToCloudinary(req.file.path, "condominio");
        const imageUrl = data.url;

        // Create new image object
        let img = new Img({
            name: req.body.name,
            imageUrl: imageUrl,
            publicId: data.public_id,
        });

        // Save image to MongoDB
        await img.save();

        // Update dser_evidencia and ser_id in PostgreSQL
        const updateQuery =
            "UPDATE res_detalle_servicio SET dser_evidencia = $1, ser_id = $2 WHERE dser_id = $3";
        const updateValues = [imageUrl, req.body.name, req.params.dser_id];
        await db.query(updateQuery, updateValues);

        res.send(`{"status":"Ok", "resp":"Asignación correcta"}`);
    } catch (err) {
        console.log(err);
        res.send(`{"status":"Error", "resp":${err}}`);
    }
};





const getImgById = async(req, res) => {
    try {
        // Find user by id
        let img = await Img.findById(req.params.id);
        res.json(img);
    } catch (err) {
        console.log(err);
    }
};


module.exports = {
    getImg,
    createImg,
    deleteImg,
    getImgById,
    updateImg
}