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
  res.json(`${req.method} request recieved to get notes`);
  console.info(`${req.method} request recieved to get reviews`);
  // fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
  //   const notes = JSON.parse(data);
  //   res.json(notes);
  // })
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

    const noteString = JSON.stringify(newNote);

    fs.writeFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const response ={
          status: "success",
          body: newNote,
        };
      }});
    }});

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
