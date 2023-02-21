const express = require("express");
const Img = require("../models/img");
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
        const query = 'INSERT INTO res_detalle_servicio (dser_evidencia, ser_id) VALUES ($1, $2)';
        const values = [imageUrl, req.body.ser_id];
        await db.query(query, values);

        // Insert MongoDB _id to PostgreSQL
        const query2 = 'INSERT INTO res_detalle_pago (id_mongo) VALUES ($1)';
        const values2 = [img._id];
        await db.query(query2, values2);
        response.send(`{"status":"Ok", "resp":"Tipo Servicio added with ID: ${img}"}`)
    } catch (err) {
        console.log(err);
        response.send(`{"status":"Error", "resp":${err}}`)
    }
};


// Delete img Image
const deleteImg = async(req, res) => {
    try {
        // Find user by id
        let img = await Img.findOne({ _id: req.params.id });
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

const updateImg = async(req, res) => {
    try {
        //Upload Image to Cloudinary
        let img = await Img.findOne({ _id: req.params.id });
        const publicId = img.publicId;
        // Delete image from cloudinary
        await removeFromCloudinary(publicId);
        const data = await uploadToCloudinary(req.file.path, "condominio");
        //Save Image Url and publiId ti the database
        const savedImg = await Img.updateOne({ _id: req.params.id }, {
            $set: {
                name: data.name,
                imageUrl: data.url,
                publicId: data.public_id,
            },
        });

        res.status(200).send("user image uploaded with success!");
    } catch (error) {
        res.status(400).send(error);
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