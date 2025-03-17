import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js"

const adminSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            default: "default.png",
        },
        name: {
            type: String,
            unique: [true, "Name already exist"],
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            unique: [true, "Email already exist"],
            required: [true, "Email is required"],
        },
        password: {
            type: String,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
        confirmEmail: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);



adminSchema.post(/^find/, async function (docs, next) {
    if (Array.isArray(docs)) {
        docs.forEach((doc) => {
            if (doc.phone) {
                const bytes = CryptoJS.AES.decrypt(doc.phone, process.env.ENCRYPTION_KEY);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                doc.phone = decrypted
            }
        });
    } else if (docs && docs.phone) {
        const bytes = CryptoJS.AES.decrypt(docs.phone, process.env.ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        docs.phone = decrypted
    }
});


adminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    } if (this.isModified("phone")) {
        this.phone = CryptoJS.AES.encrypt(this.phone, process.env.ENCRYPTION_KEY).toString(); 
    }
    next();
});



export default mongoose.model("Admin", adminSchema);