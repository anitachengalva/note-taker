const path = require("path");
const express = require("express");
const fs = require("fs");
const uuid = require("./helpers/uuid");

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
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    const notes = JSON.parse(data);
    res.json(notes);
  });
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

    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (err, results) => {
            if (err) {
              console.error(err);
            } else {
              const response = {
                status: "success",
                body: newNote,
              };
            }
          }
        );
      }
    });
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
  console.log(noteId);
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    const notes = JSON.parse(data);
    const parsedNotes = JSON.parse(data);

    const updatedNote = json.filter((notes) => notes.id !== noteId);

    parsedNotes.push(updatedNote);

    fs.writeFile(
      "./db/db.json",
      JSON.stringify(parsedNotes, null, 4),
      (err, results) => {
        if (err) {
          console.error(err);
        } else {
          const response = {
            status: "success",
            body: updatedNote,
          };
        }
      }
    );
  })
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
