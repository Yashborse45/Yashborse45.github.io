const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const cors = require("cors");
const mlRoutes = require("./routes/mlRoutes"); 

// Configure CORS to allow frontend access
app.use(cors({
    origin: [
        'http://localhost:3000', // For local development
        'https://xenith-frontend.onrender.com', // Your actual frontend URL
        'https://xenith-frontend.render.com',
        '*' // Allow all origins for now (remove this in production)
    ],
    credentials: true
}));

require('./models/model');
require('./models/post');

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));
app.use(require("./routes/category"));
app.use("/api/ml", require("./routes/mlRoutes"));

mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
    console.log("successfully connected to mongo");
});

mongoose.connection.on("error", () => {
    console.log("not connected to mongodb");
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
