const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const cors = require("cors");
const mlRoutes = require("./routes/mlRoutes"); 

app.use(cors());

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
