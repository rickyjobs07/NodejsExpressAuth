const { signupSchema } = require('../middlewares/validator');
const User = require('../models/usersModel');
const { doHash } = require('../utils/hashing');

exports.signup = async (req,res) => {

    const {email, password} = req.body;

    console.log(`El email es ${email} y el password es ${password}`);

    try {
        // Validar datos con Joi
        const { error,value } = signupSchema.validate({email,password});

        if(error){
            return res.status(401).json({success:false, message: error.details[0].message});
        }
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(401).json({success:false, message:"User already exists!"});
        }


        const hashedPassword = await doHash(password, 12);
        console.log(`Este es el hashed ${hashedPassword}`);
        const newUser = new User({
            email: email,
            password: hashedPassword,
        });

        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success:true, 
            message: "Your account has been created successfully",
        });

    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}