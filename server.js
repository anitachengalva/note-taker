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

// ROUTES -------------------------------------------------

// API Routes ---------------------------------------------
// GET /api/notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

// POST /api/notes
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const new_note = {
      title,
      text,
      noteID: uuid(),
    };

    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const notes = JSON.parse(data);

        // push new note
        notes.push(new_note);

        //update file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(notes, null, 2),
          (err, data) => {
            if (err) {
              console.error(err);
            } else {
              res.json(new_note);
            }
          }
        );
      }
    });
  }
});

// DELETE /api/notes/:id
app.delete("/api/notes/:id", (req, res) => {
  const noteID = req.params.id;
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let notes = JSON.parse(data);

      // delete note by ID
      for (let i = 0; i < notesArr.length; i++) {
        if (id === notes[i].noteID) {
          notes.splice(i, 1);
        }
      }

      //update file
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(notes, null, 2),
        (err, data) => {
          if (err) {
            console.error(err);
          } else {
            res.json(`Note ${noteID} sucessfully deleted!`);
          }
        }
      );
    }
  });
});

// HTML Routes ---------------------------------------------
// GET /notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
