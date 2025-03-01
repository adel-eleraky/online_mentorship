import multer from "multer";
import sharp from "sharp";


const multerStorage = multer.memoryStorage()


let imageFilter = (req, file , cb) => {
    if(file.mimetype.startsWith("image")) {
        cb(null , true)
    } else {
        cb(new Error("Please upload image") , false)
    }
}

export const resizePhoto = async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.params.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`)

    next()
}

const upload = multer({
    storage: multerStorage,
    fileFilter: imageFilter
})

let uploadPhoto = upload.single("image")

export default uploadPhoto