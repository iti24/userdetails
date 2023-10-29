const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    age: { type: Number },
    email: { type: String, required: true },
    dob: { type: Date, required: true },
    contactno: { type: Number },
    // imageUrl: { type: String },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
