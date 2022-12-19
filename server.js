require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const app = express();
const bodyParser = require('body-parser')
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const PORT = 3500 || process.env.PORT;



app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);

app.use("/image", express.static("upload/images"));


mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URI);

mongoose.connection.once("open", () => {
  console.log("database connected");
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
