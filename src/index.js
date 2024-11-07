//require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";
dotenv.config({
  path: "./env",
});

connectDB();

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
