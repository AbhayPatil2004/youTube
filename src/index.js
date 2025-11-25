// src/index.js
import dotenv from "dotenv";
dotenv.config(); // load .env from project root (omit path unless needed)

import connectDB from "./db/index.js";
import express from "express";

const app = express();

// parse port robustly
const PORT = Number.parseInt(process.env.PORT, 10) || 5000;

// sanity logs to debug the exact value/type
console.log("process.env.PORT (raw):", process.env.PORT, "type:", typeof process.env.PORT);
console.log("PORT (parsed int fallback):", PORT, "type:", typeof PORT);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });


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