// Suppress deprecation warnings
process.removeAllListeners('warning');

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/music", require("./routes/music"));
app.use("/spotify", require("./routes/spotify"));
app.use("/recommendation", require("./routes/recommendation"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
