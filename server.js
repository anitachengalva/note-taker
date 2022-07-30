const path = require("path");
const express = require("express");
const fs = require("fs");

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
      note_id: uuid(),
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

app.get("/api/notes/:id", (req, res) => {
  const index = req.params.id;
  res.json(notes[index]);
});

// DELETE /api/notes/:id
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const updatedNotes = parsedNotes.filter((note) => note.id !== noteId);

      fs.writeFile(
        "./db/db.json",
        JSON.stringify(updatedNotes, null, 4),
        (err, results) => {
          if (err) {
            console.error(err);
          } else {
            const response = {
              status: "success",
              body: updatedNotes,
            };
            res.json(`Item ${noteId} has been deleted 🗑️`);
          }
        }
      );
    }
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
