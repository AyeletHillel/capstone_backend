/////////////////////////
// DEPENDENCIES
/////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const { PORT = 3000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");


///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  // Connection Events
  mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

/////////////////////////
// MIDDLEWARE
/////////////////////////

app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

/////////////////////////
// Models
/////////////////////////

const ResultsSchema = new mongoose.Schema({
    input: String,
    score: Number,
    sentiment: String,
})

const Results = mongoose.model("Results", ResultsSchema)

// const results = [
//     {input: "I love you, Poo", score: 3, sentiment: "positive"},
//     {input: "I believe I can fly, I believe I can touch the sky", score: 4, sentiment: "positive"},
//     {input: "My mama don't like you and she likes everyone", score: -2, sentiment: "negative"},
//     {input: "At first I was afraid, I was petrified, kept thinkin' I could never live without you by my side", score: -3, sentiment: "negative"},
// ]

/////////////////////////
// Routes
/////////////////////////

app.get("/", (req, res) => {
    res.json({
        response: "Hello World"
    })
})

// Index
app.get("/results", async (req, res) => {
    try{
        res.json(await Results.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})


// Create
app.post("/results", async (req, res) => {
    try {
        res.json(await Results.create(req.body));
      } catch (error) {
        //send error
        res.status(400).json(error);
      }
})

// Update 
app.put("/results/:id", async (req, res) => {
    try {
        res.json(
          await Results.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
      } catch (error) {
        //send error
        res.status(400).json(error);
      }
})

// Delete
app.delete("/results/:id", async (req, res) => {
    try {
        res.json(await Results.findByIdAndRemove(req.params.id));
      } catch (error) {
        //send error
        res.status(400).json(error);
      }
})

// Show 
app.get("/results/:id", async (req, res) => {
    try {
        res.json(await Results.findById(req.params.id));
      } catch (error) {
        //send error
        res.status(400).json(error);
      }
})

/////////////////////////
// Listener
/////////////////////////

app.listen(1337, () => console.log(`Can you feel the love on port ${PORT}`))