const bcrypt = require("bcryptjs");
const User = require("../Models/userModel");
const Joi = require("joi");
const { default: mongoose } = require("mongoose");

//api/user/signup
//For all users
exports.signup = async (req, res) => {
  const signupSchema = Joi.object({
    name: Joi.string()
      .ruleset.pattern(
        new RegExp(/^[A-Za-z ]{3,20}$/),
        "Name should have at least 3 characters and should not any number!"
      )
      .rule({
        message: `Name should have at least 3 characters and should not any number!`,
      })
      .required(),
    email: Joi.string()
      .ruleset.email()
      .rule({ message: `Email is invalid` })
      .required(),
    address: Joi.string().required(),
    mobile: Joi.string()
      .ruleset.pattern(
        new RegExp(/^[0-9]{11}$/),
        "Mobile must be a number and equal to 11 numbers"
      )
      .rule({
        message: `Mobile must be a number and equal to 11 numbers`,
      })
      .required(),
    password: Joi.string()
      .ruleset.pattern(
        new RegExp(
          /^(?=.*[0-9])(?=.*[a-zA-Z ])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&* ]{8,20}$/
        ),
        "Password must contain at least 8 characters, 1 number, 1 upper, 1 lowercase and 1 special character!"
      )
      .rule({
        message: `Password must contain at least 8 characters, 1 number, 1 upper, 1 lowercase and 1 special character!`,
      })
      .required(),
  });

  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { name, email, address, mobile, password, pic } = req.body;
  try {
    const eamilExist = await User.findOne({ email });

    if (eamilExist) {
      res.status(400).json({ error: "User already exists" });
    } else {
      const user = new User({
        name,
        email,
        address,
        mobile,
        password,
        pic,
      });
      await user.save();
      const token = await user.generateToken();
      return res
        .status(200)
        .json({ success: true, token, msg: "User Registered Successfully" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//api/user/login
//For all users
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }
  try {
    const checkEmail = await User.findOne({ email });
    if (!checkEmail) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, checkEmail.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    const token = await checkEmail.generateToken();
    return res.status(200).json({ success: true, token });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server Error");
  }
};

//api/user/get-user
//Only for logged in users
exports.getUser = (req, res) => {
  return res.send(req.user);
};

//api/user/update-user
//Only for logged in users
exports.updateUser = async (req, res) => {
  const signupSchema = Joi.object({
    name: Joi.string()
      .ruleset.pattern(
        new RegExp(/^[A-Za-z ]{3,20}$/),
        "Name should have at least 3 characters and should not any number!"
      )
      .rule({
        message: `Name should have at least 3 characters and should not any number!`,
      })
      .required(),
    email: Joi.string()
      .ruleset.email()
      .rule({ message: `Email is invalid` })
      .required(),
    address: Joi.string().required(),
    mobile: Joi.string()
      .ruleset.pattern(
        new RegExp(/^[0-9]{11}$/),
        "Mobile must be a number and equal to 11 numbers"
      )
      .rule({
        message: `Mobile must be a number and equal to 11 numbers`,
      })
      .required(),
    password: Joi.string()
      .ruleset.pattern(
        new RegExp(
          /^(?=.*[0-9])(?=.*[a-zA-Z ])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&* ]{8,20}$/
        ),
        "Password must contain at least 8 characters, 1 number, 1 upper, 1 lowercase and 1 special character!"
      )
      .rule({
        message: `Password must contain at least 8 characters, 1 number, 1 upper, 1 lowercase and 1 special character!`,
      })
      .required(),
  });

  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { name, email, address, mobile, password, pic } = req.body;
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.name = name;
      user.email = email;
      user.address = address;
      user.mobile = mobile;
      user.password = password;
      user.pic = pic;
      await user.save();
      return res.status(200).json({ msg: "User Updated Successfully" });
    } else {
      return res.status(404).json({
        error: "User not found",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};
