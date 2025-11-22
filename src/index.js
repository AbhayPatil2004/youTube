// src/index.js
// Load .env first (explicit, safe)
import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // make sure the file is named .env in the project root

// Then import everything else
import connectDB from "./db/index.js";
import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

const app = express();
const PORT = process.env.PORT || 8000;

(async () => {
  try {
    // Connect DB after env loaded
    await connectDB();

    // simple server start (adjust as needed)
    app.get("/", (req, res) => res.send("Hello from YouTube clone backend"));
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();


// import express from 'express'
// const app = express()

// ( async () => {
//     try{
//         await mongoose.connect( `${process.env.MONGO_URL}/${DB_NAME}`)
//         app.on("errr" , ( error ) => {
//             console.log("Error" , error)
//             throw error
//         })

//         app.listen( process.env.PORT , () => {
//             console.log('App is Listening on port' , process.env.PORT )

//         })
//     }
//     catch(error){
//         console.error("Error" , error)
//         throw error 
//     }
// })()