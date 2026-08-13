import Therapist from "../models/Therapist.js";
import bcrypt from "bcrypt";
import { generateSlug } from "../utils/generateSlug.js";
import jwt from "jsonwebtoken";
function randomNumber() {
    return Math.floor(Math.random() * (1000000)) + 1;
}
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    const existing = await Therapist.findOne({
        email: email
    })

    if (existing) {
        return res.status(400).json({ message: "User Already Exists" });
    }

    const cleanName = generateSlug(name);
    const userSlug = cleanName + `-${randomNumber()}`;

    let isUnique = false;
    while (!isUnique) {
        const userFound = await Therapist.findOne({
            slug: userSlug
        })

        if (!userFound) {
            isUnique = true;
        }
        else {
            userSlug = cleanName + `-${randomNumber()}`;
        }
    }

    const hash_password = await bcrypt.hash(password, 10);

    const newUser = new Therapist({
        name: name,
        email: email,
        slug: userSlug,
        password_hash: hash_password
    })

    try {
        const userSaved = await newUser.save();
        console.log("User created Successfully");
        return res.status(200).json({ message: "User created successfully" });

    } catch (error) {
        console.log(error);
    }



}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {


        const existingUser = await Therapist.findOne({
            email: email
        })

        if (!existingUser) {
            return res.status(401).json({
                message: "User not found"
            })
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password_hash)

        if (!matchPassword) return res.status(401).json({ message: "Bad Credentials" });

        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '7h'
            }
        )

        return res.status(200).json({
            message: "Logged In Successfully",
            token: token
        })
    } catch (err) {
        console.log(err);
    }
}