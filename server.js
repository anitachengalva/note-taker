const path = require("path");
const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
// const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

// ROUTES -------------------------------------------------
// API Routes ---------------------------------------------
// GET /api/notes
app.get("/api/notes", (req, res) => {
  res.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// POST /api/notes
// should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

// DELETE /api/notes/:id
// should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

// HTML Routes ---------------------------------------------
// GET /notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
