// const mongoose = require("mongoose")
import mongoose from "mongoose"

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
}, { timestamps: true });

// module.exports = mongoose.model("notice", noticeSchema);
export const Notice = mongoose.model("notice", noticeSchema);