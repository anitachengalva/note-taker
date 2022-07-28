const path = require("path");
const parse = require("path");
const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
const notes = require("./db/db.json");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ROUTES -------------------------------------------------

// GET routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
    const parsed_notes = JSON.parse(data);
    res.json(parsed_notes);
  })
});

app.get("/api/notes/:id", (req, res) => {
  const index = req.params.id;
  res.json(notes[index]);
});

// POST routes
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const new_note = {
      title,
      text,
      noteID: uuid.v4(),
    };

    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, notes) => {
      if (err) {
        console.error(err);
      } else {
        const parsed_notes = JSON.parse(notes);

        // push new note
        parsed_notes.push(new_note);

        //update file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsed_notes, null, 4),
          "utf8",
          (err, notes) => {
            (err) => {
              if (err) return console.log(err);
              res.json(new_note);
            };
          }
        );
      }
    });
  }
});

// DELETE /api/notes/:id
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  fs.readFile("./db/db.json", (err, notes) => {
    if (err) throw err;
    let parsed_notes = JSON.parse(notes);
    console.log(parsed_notes[0].id);

    for (let i = 0; i < parsed_notes.length; i++) {
      if (id === parsed_notes[i].id) {
        parsed_notes.splice(i, 1);
      }
    }

    fs.writeFile(
      "./db/db.json",
      JSON.stringify(parsed_notes, null, 2),
      "utf8",
      (err) => {
        if (err) return console.log(err);
        res.json(`Note ${id} has been sucessfully deleted!`);
      }
    );
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
