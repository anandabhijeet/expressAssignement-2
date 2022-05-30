const express = require("express");
const connection = require("./database");
const uuid = require("uuid");
const app = express();
const port = 3001;

app.use(express.json());

// To get all the users
app.get("/api/v1/users", (req, res) => {
  try {
    let sql_query = "SELECT * FROM USER";
    connection.query(sql_query, (err, data) => {
      if (err) throw err;

      res.status(200).json({
        status: "success",
        data: {
          data,
        },
      });
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

//To signup new user
app.post("/api/v1/signup", (req, res) => {
  try {
    let search_email_query = `SELECT * FROM USER WHERE email='${req.body.email}'`;
    connection.query(search_email_query, (err, data) => {
      if (err) {
        res.send(err);
      }

      if (data.length > 0) {
        res.status(409).send("Email already exist");
      } else {
        let update_query = "INSERT INTO USER SET ?";
        let newUser = {
          phone: req.body.phone,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          id: uuid.v4(),
        };
        connection.query(update_query, newUser, (err, result) => {
          if (err) {
            res.status(409).send(err);
          }

          res.status(200).json({
            status: "registered",
            data: result,
          });
        });
      }
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

// To login user
app.post("/api/v1/login", (req, res) => {
  try {
    let sql_query = `SELECT * FROM USER WHERE email='${req.body.email}' AND password='${req.body.password}'`;
    connection.query(sql_query, (err, data) => {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({
          status: "user found",
          data: {
            data,
          },
        });
      } else {
        res.status(404).send("User Not Found");
      }
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

//To Update new User
app.patch("/api/v1/users/update", (req, res) => {
  try {

    let keys = Object.keys(req.body);
    const checkIfEmail = keys.find(el=> el === "email");
    if(checkIfEmail){
      res.send("sorry can't change email address!!")
    }else{
      let search_email_query = `SELECT * FROM USER WHERE id='${req.query.id}'`;
      connection.query(search_email_query, (err, data) => {
        if (err) res.status(404).send(err);
        if (data.length <= 0) {
          res.status(409).send("Email does Not Exists");
        }
  
        let newUpdate = req.body;
        let patch_query = `UPDATE USER SET ? WHERE id=?`;
        connection.query(patch_query, [newUpdate, req.query.id], (err, data) => {
          if (err) res.status(409).send(err);
          res.status(200).json({
            status: "updated",
          });
        });
      });
    }
   
  } catch (err) {
    res.status(404).send(err);
  }
});

//To Delete new User
app.delete("/api/v1/users/delete", (req, res) => {
  try {
    let search_email_query = `SELECT * FROM USER WHERE id='${req.query.id}'`;
    connection.query(search_email_query, (err, data) => {
      if (err) res.status(404).send(err);
      if (data.length <= 0) {
        res.status(409).send("Email does Not Exists");
      }

      let delete_query = `DELETE FROM user WHERE id='${req.query.id}'`;
      connection.query(delete_query, (err, data) => {
        if (err) res.status(409).send(err);
        res.status(200).send("user deleted");
      });
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

app.listen(port, () => {
  console.log("Listening....");
  connection.connect((err) => {
    if (err) throw err;
    console.log("database connected");
  });
});
