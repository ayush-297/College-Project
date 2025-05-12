// const mongoose = require("mongoose")
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Teacher",
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    teachSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
    },
    teachSclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        students: [
          {
            studentId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "student",
              required: true,
            },
            status: {
              type: String,
              enum: ["present", "absent"],
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// module.exports = mongoose.model("teacher", teacherSchema)
export const Teacher = mongoose.model("teacher", teacherSchema);
