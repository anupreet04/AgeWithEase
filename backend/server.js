const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://admin:2005@ac-lpfrfbg-shard-00-00.ypwga87.mongodb.net:27017,ac-lpfrfbg-shard-00-01.ypwga87.mongodb.net:27017,ac-lpfrfbg-shard-00-02.ypwga87.mongodb.net:27017/agewithease?ssl=true&replicaSet=atlas-m57kh6-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// import model
const Profile = require("./models/Profile");

// test route
app.get("/", (req, res) => {
    res.send("AgeWithEase Backend Running 🚀");
});

// ================= PROFILE =================

// save profile
app.post("/save-profile", async (req, res) => {
    try {
        const newProfile = new Profile(req.body);
        await newProfile.save();
        res.send("Profile Saved ✅");
    } catch (err) {
        res.status(500).send(err);
    }
});

// get profile
app.get("/get-profile", async (req, res) => {
    try {
        const profile = await Profile.findOne().sort({ _id: -1 });
        res.json(profile);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ================= ROUTINE =================

app.post("/save-routine", async (req, res) => {
    try {
        console.log("Incoming Routine Data:", req.body); // debug

        const db = mongoose.connection;
        await db.collection("routines").insertOne(req.body);

        res.send("Routine Saved ✅");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
// GET ROUTINE DATA
app.get("/get-routine", async (req, res) => {
    try {
        const db = mongoose.connection;

        // latest 4 tasks (recent activity)
        const data = await db.collection("routines")
            .find()
            .sort({ _id: -1 })
            .limit(4)
            .toArray();

        res.json(data);

    } catch (err) {
        res.status(500).send(err);
    }
});

// ================= START SERVER =================

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
