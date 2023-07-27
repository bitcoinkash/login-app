const dotenv = require("dotenv");
const pg = require("pg");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

dotenv.config();
const app = express();

const path = require("path");

const buildPath = path.join(__dirname, "../client/codingtest/dist");

app.use(express.static(buildPath));

app.get("/*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"),
    function(err) {
        if (err) {
            res.status(500).send(err);
        }
    }
    
    );
});

app.use(cors());
app.use(express.json());

const port = 3000;
const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });



app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    pool
      .query(sql)
      .then((data) => {
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: "Server error" });
      });
})

app.post('/login', (req, res) => {
    const sql = "SELECT id, * FROM users WHERE username = $1 OR email = $1"; // Include id in the SELECT statement
    const values = [req.body.name];
    pool
      .query(sql, values)
      .then((data) => {
        if (data.rows.length > 0) {
          const user = data.rows[0];
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
              res.json({ data: { id: user.id, username: user.username, email: user.email } }); // Return the ID only in the response
            } else {
              res.status(401).json({ error: "Invalid password" });
            }
          });
        } else {
          res.status(404).json({ error: "User not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "Server error" });
      });

})

app.post('/register', (req, res) => {
  const sql = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *"; // Include id in the SELECT statement
  //hashing password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hash;

  const values = [req.body.name, req.body.email, req.body.password];
  pool
    .query(sql, values)
    .then((data) => {
        if (data.body.name === req.body.name) {
          res.status(409).json({ error: "User already exists" });
        } else {
          res.json({ data: { id: data.rows[0].id } }); // Return the ID only in the response
        }
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
})

app.listen(port, () => {
    
    console.log(`Example app listening on port ${port}`);

})