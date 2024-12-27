const mongoose = require("mongoose");
const initData = require("./data.js");  // Assuming this is your data file
const Listing = require("../models/listing.js"); // Assuming Listing is a Mongoose model

const MONGO_URL = "mongodb+srv://dasgopal:root2525@cluster0.plqkn.mongodb.net/wanderlust"; // Your MongoDB URL

// Connecting to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });

// Function to connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL);
};

// Function to initialize the database
const initDB = async () => {
  try {
    // Deleting all existing listings
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj) =>({
      ...obj,
      owner:"676514c06f2f6418d87ef01c",
    }))
    console.log("All listings deleted");
    

    // Inserting the new data
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.log("Error initializing data:", err);
  }
};

// Initialize the database
initDB();
