// const mongoose = require("mongoose");
import mongoose from "mongoose";

const sclassSchema = new mongoose.Schema({
    sclassName: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
}, { timestamps: true });

// module.exports = mongoose.model("sclass", sclassSchema);
export const Sclass = mongoose.model("sclass", sclassSchema);

