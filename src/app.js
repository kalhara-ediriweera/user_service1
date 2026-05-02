const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "user-service",
    status: "healthy"
  });
});

// 👇 ADD THIS
module.exports = app;

// 👇 run only if not testing
if (require.main === module) {
  app.listen(5000, () => console.log("Server running"));
}