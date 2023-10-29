const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");

// Signup logic
const signup = async (req, res) => {
  console.log("signup");
  try {
    const { username, password, age, email, dob, contactno } = req.body;
    console.log(req.body);

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingemail = await User.findOne({ email });
    console.log(existingemail);
    if (existingemail) {
      return res.status(400).json({ error: "email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    console.log(saltRounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);

    // Create a new user
    const newUser = new User({
      username: username,
      password: hashedPassword,
      age: age,
      email: email,
      dob: dob,
      contactno: contactno,
      //   imageUrl: req.file.location,
    });
    console.log(newUser);
    await newUser.save();
    res.status(201).json({ message: "the user save successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { emailuserId, password } = req.body;
    console.log("emailuserId", emailuserId, "password", password);
    const user = await User.find({
      $or: [
        { username: { $regex: emailuserId, $options: "i" } },
        { email: { $regex: emailuserId, $options: "i" } },
      ],
    });
    console.log(user);

    if (!user) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    const matchedPassword = await bcrypt.compare(password, user[0].password);

    console.log("matchedPassword", matchedPassword);
    if (!matchedPassword) {
      return res.status(401).json({ error: "Invalid credential" });
    }
    const token = jwt.sign({ userId: user[0]._id }, config.jwtSecret, {
      expiresIn: "1h", // Token expires in 1 hour (adjust as needed)
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number (default to 1)
    const perPage = parseInt(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;
    const users = await User.find().skip(skip).limit(perPage);

    res.status(201).json(users);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    if (user == null) {
      res.status(404).json({ message: "user update failed" });
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser.deletedCount === 0) {
      res.status(404).json({ message: "User details not found" });
    }
    res.status(201).json(deletedUser);
  } catch (error) {
    res.status(501).json({ error: error.message });
  }
};

module.exports = { signup, login, getUser, updateUser, deleteUser };
