require("dotenv").config()

const mongoose = require('mongoose');

const app = require('./app')

const DB_URI = process.env.DB_URI;

mongoose.set("strictQuery", true)

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000")
    })
    console.log("Database connection successful")
  })
  .catch((error) => {
    console.log(error.message)
    process.exit(1)
  })