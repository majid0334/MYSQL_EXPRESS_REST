const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json());

// getDb returns a connection to the database
// getDb is used by all the functions below

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_favoritesongg",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected!");
  }
});

//Users table

app.post("/post", (req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  const age = req.body.age;
  //skickar in våra tre tycper av data
  connection.query(
    "INSERT INTO users VALUES(?, ?, ?)",
    [id, name, age],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("posted");
      }
    }
  );
});

app.get("/get", (req, res) => {
  connection.query("SELECT * FROM users", (err, result, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/get/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM users WHERE id=?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/update/:id", (req, res) => {
  const id = req.params.id; // Retrieve the id from req.params
  const name = req.body.name;
  const age = req.body.age;
  connection.query(
    "UPDATE users SET name=?, age=? WHERE id=?",
    [name, age, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        if (result.affectedRows === 0) {
          res.send("id not present");
        } else {
          res.send("UPDATED");
          console.log(result);
        }
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM users WHERE id=?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("delete");
    }
  });
});

//Song List table

//To add favorite song in song list
app.post("/post_favorite_song", (req, res) => {
  const { song_id, song_name } = req.body;
  // Perform the SQL query
  connection.query(
    "INSERT INTO favorite_songs (song_id, song_name) VALUES (?, ?)",
    [song_id, song_name],
    (error, results) => {
      if (error) {
        console.error("Error inserting song:", error);
        res.status(500).json({ error: "Failed to insert song" });
      } else {
        res.status(201).json({ message: "Song inserted successfully" });
      }
    }
  );
});

//DElETE SONG
app.delete("/favorite_songs/:songId", (req, res) => {
  const songId = req.params.songId;

  // Perform the SQL query
  connection.query(
    "DELETE FROM favorite_songs WHERE song_id = ?",
    [songId],
    (error, results) => {
      if (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({ error: "Failed to delete song" });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ error: "Song not found" });
        } else {
          res.status(200).json({ message: "Song deleted successfully" });
        }
      }
    }
  );
});

//GET ONE SONG
app.get("/favorite_songs", (req, res) => {
  // Perform the SQL query
  connection.query("SELECT * FROM favorite_songs", (error, results) => {
    if (error) {
      console.error("Error retrieving songs:", error);
      res.status(500).json({ error: "Failed to retrieve songs" });
    } else {
      res.status(200).json(results);
    }
  });
});

//to do add a song to a user
app.post("/users/:userId/favorite_songs", (req, res) => {
  const songId = req.params.userId;
  const { song_name } = req.body;

  // Perform the SQL query
  connection.query(
    "INSERT INTO favorite_songs (song_id, song_name) VALUES (?, ?)",
    [songId, song_name],
    (error, results) => {
      if (error) {
        console.error("Error adding song to user:", error);
        res.status(500).json({ error: "Failed to add song to user" });
      } else {
        res.status(201).json({ message: "Song added to user successfully" });
      }
    }
  );
});

//See user with favorite song
app.get("/favorite_songs_with_users", (req, res) => {
  connection.query(
    "SELECT fs.song_name, u.id, u.name, u.age FROM favorite_songs fs JOIN users u ON fs.song_id = u.id",
    (error, results) => {
      if (error) {
        console.error("Error retrieving favorite songs with users:", error);
        res.status(500).json({ error: "Failed to retrieve data" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});
app.listen(5500, () => {
  console.log(`http://localhost:5000/`);
});
