const transport = require('../middlewares/sendMail');
const { signupSchema, signinSchema, acceptCodeSchema, changePasswordSchema, forgotPasswordSchema } = require('../middlewares/validator');
const User = require('../models/usersModel');
const { doHash, doHashValidation, hmacProcess } = require('../utils/hashing');
const jwt = require('jsonwebtoken');

exports.signup = async (req,res) => {
    const {email, password} = req.body;
    try {
        // Validar datos con Joi
        const { error } = signupSchema.validate({email,password});
        if(error){
            return res.status(401).json({success:false, message: error.details[0].message});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({success:false, message:"User already exists!"});
        }

        const hashedPassword = await doHash(password, 12);
        const newUser = new User({
            email: email,
            password: hashedPassword,
        });

        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success:true, 
            message: "Your account has been created successfully",
            result
        });

    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.signin = async (req, res) =>{
    const { email, password } = req.body;
    try {
        const {error, value} = signinSchema.validate({email, password});
        if(error){
            return res.status(401).json({success:false,message: error.details[0].message});
        }

        const existingUser = await User.findOne({email}).select('+password');
        if (!existingUser) {
            return res.status(404).json({success:false, message:'User does not exist'});
        }

        const result = await doHashValidation(password, existingUser.password);

        if (!result) {
            return res.status(401).json({success:false, message: 'Invalid credentials!'});
        }

        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,
        },
        process.env.TOKEN_SECRET,{
            expiresIn:'8h'
        }
    );

    res.cookie('Authorization', 'Bearer' + token, 
        { expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        }).json({
                success: true,
                token,
                message: "logged in successfully",
            });

    } catch (error) {
        console.error("Error in signin:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.signout = async (req, res) => {
    try {
        res.cookie('Authorization', '', {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error("Error in signout:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.sendVerificationCode = async (req,res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res.status(404).json({success: false, message: "User does not exist!"});
        }
        if (existingUser.verified) {
            return res.status(400).json({success: false, message: "You are already verified!"}); 
        }

        const codeValue = Math.floor(Math.random() * 1000000).toString();

        let info = await transport.sendMail({
            from: process.env.NODE_SENDING_EMAIL,
            to: existingUser.email,
            subject: "Verification Code",
            html: '<h1>' + codeValue + '</h1>'
        });

        if (info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({success:true, message:'Code send!'});
        }

        return res.status(400).json({success:true, message:'Code send failed!'});


    } catch (error) {
        console.log("Error in sendVerificationCode: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

exports.verifyVerificationCode = async (req, res) => {

    const {email, providedCode} = req.body;

    try {
        const {error, value} = acceptCodeSchema.validate({email, providedCode});
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message});
        }

        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({email}).select("+verificationCode +verificationCodeValidation")

        if (!existingUser) {
            return res
                .status(401)
                .json({success:false, message: 'User does not exists!'})
        }
        if (existingUser.verified) {
            return res.status(400).json({success: false, message: 'You are already verified!'});
        }

        if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
            return res.status(400).json({success: false, message: 'Something is wrong with the code!'});
        }
        if (Date.now() - existingUser.verificationCodeValidation > 5* 60 *1000) {
            return res.status(400).json({success: false, message: 'Code has been expired!'});
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE);

        if (hashedCodeValue === existingUser.verificationCode) {
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save();
            return res.status(200).json({success: true, message: 'Your account has been verified'});
        }
        return res.status(400).json({success:false, message: 'Uneexpected occured!'});

    } catch (error) {
        console.log("Error in verifyVerificationCode: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

exports.changePassword = async (req,res) => {
    const { userId, verified} = req.user;
    const {oldPassword, newPassword} = req.body;

    try {
        const {error, value} = changePasswordSchema.validate({newPassword, oldPassword});

        if (error) {
            return res.status(400).json({success: false, message: error.details[0].message})
        }
        if (!verified) {
            return res.status(401).json({success: false, message: 'You are not verified user!'})
        }
        const existingUser = await User.findOne({_id: userId}).select('+password');

        if (!existingUser) {
            return res.status(404).json({success: false, message: 'User does not exists!'});
        }
        const result = await doHashValidation(oldPassword, existingUser.password);
        if (!result) {
            return res.status(401).json({success: false, message: 'Invalid credentials!'});
        }

        const hashedPassword = await doHash(newPassword, 12);
        existingUser.password = hashedPassword;
        await existingUser.save();

        return res.status(200).json({message: 'Your password has been changed!!'});

    } catch (error) {
        console.log("Error in change password: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

exports.sendForgotPasswordCode = async (req,res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res.status(404).json({success: false, message: "User does not exist!"});
        }

        const codeValue = Math.floor(Math.random() * 1000000).toString();

        let info = await transport.sendMail({
            from: process.env.NODE_SENDING_EMAIL,
            to: existingUser.email,
            subject: "Forgot Password Code",
            html: '<h1>' + codeValue + '</h1>'
        });

        if (info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE);
            existingUser.forgotPasswordCode = hashedCodeValue;
            existingUser.forgotPasswordCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({success:true, message:'Code send!'});
        }

        return res.status(400).json({success:true, message:'Code send failed!'});


    } catch (error) {
        console.log("Error in sendVerificationCode: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

exports.verifyForgotPasswordCode = async (req, res) => {

    const {email, providedCode, newPassword} = req.body;

    try {
        const {error, value} = forgotPasswordSchema.validate({email, providedCode, newPassword});
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message});
        }

        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({email}).select("+forgotPasswordCode +forgotPasswordCodeValidation")

        if (!existingUser) {
            return res
                .status(401)
                .json({success:false, message: 'User does not exists!'})
        }

        if (!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation) {
            return res.status(400).json({success: false, message: 'Something is wrong with the code!'});
        }
        if (Date.now() - existingUser.forgotPasswordCodeValidation > 5* 60 *1000) {
            return res.status(400).json({success: false, message: 'Code has been expired!'});
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE);

        if (hashedCodeValue === existingUser.forgotPasswordCode) {
            const hashedPassword = await doHash(newPassword, 12);
            existingUser.password = hashedPassword;
            existingUser.forgotPasswordCode = undefined;
            existingUser.forgotPasswordCodeValidation = undefined;
            await existingUser.save();
            return res.status(200).json({success: true, message: 'Your password has been changed!'});
        }
        return res.status(400).json({success:false, message: 'Uneexpected occured!'});

    } catch (error) {
        console.log("Error in verifyVerificationCode: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}