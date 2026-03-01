import express from "express";
import {shortenedRoutes} from "./routes/shortener.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
// app.set("views","./views")

app.use(shortenedRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});