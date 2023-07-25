const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const userInfo = { email, hashPassword: hash }; // Change 'password' to 'hashPassword'
        const newUser = await new User(userInfo);
        const savedUser = await newUser.save();
        res.status(200).json({ success: true, data: savedUser });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

const loginUser = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;
        console.log('Received email and password:', email, password);

        // Get user from database
        const foundUser = await User.findOne({ email });
        console.log('Found user:', foundUser);

        if (!foundUser) {
            console.log('No user found with this email');
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Check if password is correct
        console.log(`Comparing password ${password} with hash ${foundUser.hashPassword}`);
const isPasswordValid = await bcrypt.compare(password, foundUser.hashPassword);

        console.log('Is password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Password is not valid');
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate a token and send it back to the user
        const token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        console.log('Generated token:', token);

        res.status(200).json({ success: true, data: foundUser, token: token });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
}

const validateUser = (req, res, next) => {
    try {
       const decodedToken = res.locals.decodedToken
       const findUser = User.findOne({_id: decodedToken.id})

       if(!findUser){
           return res.status(400).json({success: false, message: "Invalid token"})
       }
       res.status(200).json({success: true, email: findUser.email})
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid token", error: error });
    }
}


module.exports = { createUser, loginUser, validateUser };