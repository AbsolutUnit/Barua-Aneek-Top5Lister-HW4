const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        }).send();
    })
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, passwordHash
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (request, result) => {
    try {
        const {email, password} = request.body;
        console.log(email);
        console.log(password);
        if (!email && !password) {
            return result.status(400).json({errorMessage: "Please enter valid values for both."});
        }
        else if (!email) {
            return result.status(400).json({errorMessage: "Please enter a valid email."});
        } else if (!password) {
            return result.status(400).json({errorMessage: "Please enter a valid password."});
        }
        const user = await User.findOne({email: email});
        if (!user) {
            return result.status(400).json({success: false, errorMessage: "Invalid User Login."});
        } else if (!bcrypt.compareSync(password, user.passwordHash)) {
            return result.status(400).json({success: false, errorMessage: "Invalid Credentials."});
        }
        const tok = auth.signToken(user);
        await result.cookie("token", tok, {httpOnly: true, secure: true, sameSite: "none"}).status(200).json({
            success: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        }).send();
    } catch (err) {
        console.log(err);
        console.log("Cock and ball torture")
    }
}

logoutUser = async (request, result) => {
    await result.clearCookie("token").status(200).send();
}

module.exports = {
    getLoggedIn,
    registerUser,
    logoutUser,
    loginUser
}