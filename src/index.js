//require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import { app } from "./app.js";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";
dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection failed at the connectDB", err);
  });

/*
import mongoose from "mongoose";
import "dotenv/config";
import { DB_NAME } from "./constants";
import express from "express";
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("error has been found on mongoose DB connection", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      `app is listening on the port ${process.env.PORT}`;
    });
  } catch (error) {
    console.log("error has found on catch block", error);
  }
  throw error;
})();
*/
