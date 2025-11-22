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

connectDB()
.then( () => {
  app.listen( PORT || 8000 , () => {
    console.log( `Server is Listening on PORT ${PORT}`)
  })
})
.catch( (err) => {
  console.log("Mongo DB Connection Failed" , err)
})


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