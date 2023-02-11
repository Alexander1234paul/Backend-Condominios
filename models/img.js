const mongoose = require('mongoose')

const imgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    publicId: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: false
    }
}, { timestamps: true })

const Img = mongoose.model('Img', imgSchema)

module.exports = Img