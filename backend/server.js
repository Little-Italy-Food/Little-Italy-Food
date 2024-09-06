const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const contact = require("./routes/contactRoutes");
require("dotenv").config();
const path = require("path");
const recipeRoutes = require("./routes/reciperoutes");
const postRoutes = require("./routes/postRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(
    "mongodb+srv://bn7bkn:dZj6eiruj3JnznzO@attout.n2ukx.mongodb.net/littleItaly?retryWrites=true&w=majority&appName=attout",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//contact
app.use("/api/", contact);
app.use("/api/users", require("./routes/usersroutes"));
app.use("/api/dishes", require("./routes/dishroutes"));
app.use("/api/dishescategory", require("./routes/dishescategoryroutes"));
app.use("/api/recipes", require("./routes/reciperoutes"));
app.use("/api/comments", require("./routes/commentsroutes"));
app.use("/api/ratings", require("./routes/ratingsroutes"));
app.use("/api/orders", require("./routes/ordersroutes"));
app.use("/api/discounts", require("./routes/discountroutes"));
app.use("/api/notifications", require("./routes/notificationroutes"));
app.use("/api/chefs", require("./routes/chefsroutes"));
app.use("/api/subscriptions", require("./routes/subscriptionroutes"));
app.use("/api", reviewRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/posts", postRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
