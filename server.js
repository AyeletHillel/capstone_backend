require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const PORT = process.env.PORT || 4000
const DATABASE_URL = process.env.DATABASE_URL

const app = express()

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection
  .on('open', () => console.log('You are connected to mongoose'))
  .on('close', () => console.log('You are disconnected from mongoose'))
  .on('error', (error) => console.log(error))

const ResultsSchema = new mongoose.Schema({
  input: String,
  score: Number,
  sentiment: String,
})

const Results = mongoose.model('Results', ResultsSchema)

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ response: 'Hello World' })
})

app.get('/results', async (req, res) => {
  try {
    res.json(await Results.find({}))
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/results', async (req, res) => {
  try {
    res.json(await Results.create(req.body))
  } catch (error) {
    res.status(400).json(error)
  }
})

app.put('/results/:id', async (req, res) => {
  try {
    res.json(
      await Results.findByIdAndUpdate(req.params.id, req.body, { new: true })
    )
  } catch (error) {
    res.status(400).json(error)
  }
})

app.delete('/results/:id', async (req, res) => {
  try {
    res.json(await Results.findByIdAndRemove(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})

app.get('/results/:id', async (req, res) => {
  try {
    res.json(await Results.findById(req.params.id))
  } catch (error) {
    res.status(400).json(error)
  }
})

app.listen(PORT, () => {
  console.log(`Can you feel the love on port ${PORT}`)
})
