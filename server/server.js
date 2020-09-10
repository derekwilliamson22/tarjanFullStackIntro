// requries
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const pg = require("pg"); // this is what lets us talk to db

// uses
app.use(express.static("server/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// globals
const port = 3000;

// db setup
const Pool = pg.Pool;
// configure the connection to db
const pool = new Pool({
  database: "music_library", // db name (NOT table name)
  host: "localhost", // deafult when running locally, will change when deploying
  port: 5432, // default port for local, also will change when deployed
  max: 12, // max # of connections
  idleTimeoutMillis: 20000, // connection time out in ms
}); // end pool setup

// spin up server
app.listen(port, () => {
  console.log("server up:", port);
}); // end server up

app.get("/songs", (req, res) => {
  console.log("in /songs GET");
  // test query: top 40 songs by rank
  // SELECT * FROM "songs" ORDER BY "rank" DESC LIMIT 40;
  const queryString = 'SELECT * FROM "songs" ORDER BY "rank" ASC LIMIT 40;';
  pool
    .query(queryString)
    .then((results) => {
      res.send(results.rows); //runs if query was successful
    })
    .catch((err) => {
      console.log(err); // if there was an error running query
      res.sendStatus(500);
    }); // end query
}); // end /songs GET

app.post("/songs", (req, res) => {
  console.log("in /songs POST:", req.body);
  // create query string
  const queryString = `INSERT INTO "songs" (rank, artist, track, published) VALUES ( $1, $2, $3, $4 )`;
  // ask pool to run our Query String
  pool
    .query(queryString, [
      req.body.rank,
      req.body.artist,
      req.body.track,
      req.body.published,
    ])
    .then((results) => {
      res.sendStatus(201); // success, created
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    }); // end query
}); // end /songs POST

app.delete("/songs/:id", (req, res) => {
  const queryString = `DELETE FROM "songs" WHERE "id" = $1;`; // TODO
  let songId = req.params.id;

  pool
    .query(queryString, [songId])
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.sendStatus(500);
    });
}); // end deleteSong

app.get("/songs/:id", (req, res) => {
  console.log("song id to retrieve", req.params.id);

  let songId = req.params.id;
  const queryString = `SELECT * FROM "songs" WHERE "id" = $1;`;
  pool
    .query(queryString, [songId])
    .then((results) => {
      res.send(results.rows);
    })
    .catch((err) => {
      console.log("ERROR!", err);
      res.sendStatus(500);
    });
});

app.put( '/songs/:id', (req, res) => {
    console.log('params', req.params.id, req.body);
    res.sendStatus(200);
});