function uploadImage(req, res){
    if(req.file.filename){
        res.status(201).json({
            message: 'Image uploaded successfully',
            url: req.file.filename
        })
    } else {
        res.status(500).json({
            message: 'Something is not working well'
        })
    }
}


module.exports = {
    uploadImage: uploadImage
}