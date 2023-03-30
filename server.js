/////////////////////////
// DEPENDENCIES
/////////////////////////
// get .env variables
require("dotenv").config()
const PORT = process.env.PORT || 4000
const DATABASE_URL = process.env.DATABASE_URL
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
// Models
/////////////////////////

const ResultsSchema = new mongoose.Schema({
    input: String,
    score: Number,
    sentiment: String,
})

const Results = mongoose.model("Results", ResultsSchema)

///////////////////////////////
// MiddleWare
////////////////////////////////

app.use(cors({ origin: '*' })); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies


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

app.listen(PORT, () => console.log(`Can you feel the love on port ${PORT}`))