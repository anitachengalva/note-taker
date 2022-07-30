const path = require("path");
const express = require("express");
const fs = require("fs");
const notes = require("./db/db.json")

const uuid = require("./helpers/uuid");
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("./helpers/fsUtils");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ROUTES -------------------------------------------------

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET request for notes
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request recieved to get notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST request to add a note
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`New Note added successfully 🚀`);
  } else {
    res.error('Error in adding Note');
  }
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// GET request for notes by ID
app.get("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((notes) => notes.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No Notes with that ID');
    });
});

// DELETE /api/notes/:id
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
  .then((data) => JSON.parse(data))
  .then((json) => {
    const result = json.filter((notes) => notes.id !== noteId);
    writeToFile('./db/db.json', result);
    res.json(`Item ${noteId} has been deleted 🗑️`);
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
