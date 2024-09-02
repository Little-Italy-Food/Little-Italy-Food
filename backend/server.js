const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
// mongodb+srv://bn7bkn:<db_password>@attout.n2ukx.mongodb.net/?retryWrites=true&w=majority&appName=attout
mongoose
  .connect(
    "mongodb+srv://ata:12345@project6.qk7e1.mongodb.net/?retryWrites=true&w=majority&appName=project6",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/users", require("./routes/usersroutes"));
app.use("/api/dishes", require("./routes/dishroutes"));
app.use("/api/recipes", require("./routes/reciperoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
