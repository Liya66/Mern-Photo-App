import express from "express";

const app = express();

app.use("/test", (req, res) => {
    return res.json("Welcome to the backend APi")
});

app.listen(3000, () => {
    console.log("Server is running~")
});
