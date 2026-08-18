import fs from "fs"
import dotenv from "dotenv";
import Therapist from "./src/models/Therapist.js";
import { connectDB } from "./src/config/db.js";
const users = JSON.parse(fs.readFileSync("./thera.data.json","utf-8"));

dotenv.config();


async function SeedUsers() {

    for (const user of users) {

        const response = await fetch(`http://localhost:${process.env.PORT}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...user,
                password: process.env.SEED_PASSWORD
            })
        });

        const messJson = await response.json();

        console.log(messJson.message);


    }
}

async function updateSeededUsers(){
    for(const user of users){
        const res = await Therapist.findOneAndUpdate(
            {email:user.email},
            {
                bio: user.bio,
    specializations: user.specializations,
    languages: user.languages
            },
            { new: true }
        )
        console.log(res);
    }
}
// SeedUsers();

connectDB().then(updateSeededUsers());

