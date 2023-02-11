const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: "dmdvfl0r4",
    api_key: "628777889745589",
    api_secret: "6FlH0zQY3BuxwuVe4vEN2tz_tNY"
})

uploadToCloudinary = (path, folder) => {
    return cloudinary.v2.uploader.upload(path, {
        folder
    }).then((data) => {
        return { url: data.url, public_id: data.public_id };
    }).catch((error) => {
        console.log(error)
    })
}

removeFromCloudinary = async(public_id) => {
    await cloudinary.v2.uploader.destroy(public_id, function(error, result) {
        console.log(result, error)
    })
}

module.exports = { uploadToCloudinary, removeFromCloudinary }