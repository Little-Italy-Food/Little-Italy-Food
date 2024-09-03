const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contact = require("./routes/contactRoutes");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


//contact
app.use("/api/", contact);


mongoose.connect('mongodb+srv://bn7bkn:dZj6eiruj3JnznzO@attout.n2ukx.mongodb.net/littleItaly?retryWrites=true&w=majority&appName=attout', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', require('./routes/usersroutes'));
app.use('/api/dishes', require('./routes/dishroutes'));
app.use('/api/recipes', require('./routes/reciperoutes'));



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));