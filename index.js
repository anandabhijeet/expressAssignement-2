const express = require("express");
const connection = require("./database");
const app = express();
const port = 3001;

app.use(express.json());


// To get all the users
app.get("/api/v1/users", (req, res) => {
   
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
});

//To signup new user
app.post('/api/v1/signup', (req, res)=>{
    let search_email_query = `SELECT * FROM USER WHERE email='${req.body.email}'`; 
    connection.query(search_email_query, (err, data)=>{
        if(err){
            res.send(err)
        };

        
        if(data.length>0){
            res.status(409).send("Email already exist");
        }
        else{
            let update_query = 'INSERT INTO USER SET ?';
            let newUser = {
                phone: req.body.phone,
                name: req.body.name,    
                email: req.body.email,
                password: req.body.password,
            };
            connection.query(update_query, newUser, (err, result)=>{
                if(err){
                    res.status(409).send(err)
                }

                res.status(200).json({
                    status:"registered",
                    data: result
                })
            })
        }
    })
})

// To login user
app.post("/api/v1/login", (req, res) => {
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
});

//To Update new User
app.patch("/api/v1/users/update", (req, res)=>{
    console.log(req.query);
    let search_email_query = `SELECT * FROM USER WHERE email='${req.query.email}'`;
    connection.query(search_email_query, (err, data)=>{
        if(err)res.status(404).send(err);
        if(data.length<=0){
            res.status(409).send("Email does Not Exists")
        }

        let newUpdate = req.body;
        let patch_query = `UPDATE USER SET ? WHERE email=?`;
        connection.query(patch_query,[newUpdate, req.query.email],(err, data)=>{
          if(err)res.status(409).send(err);
          res.status(200).json({
              status:"updated"
          })  
        })  

    })
})

//To Delete new User
app.delete("/api/v1/users/delete", (req, res)=>{
    let search_email_query = `SELECT * FROM USER WHERE email='${req.query.email}'`;
    connection.query(search_email_query, (err, data)=>{
        if(err)res.status(404).send(err);
        if(data.length<=0){
            res.status(409).send("Email does Not Exists")
        }

        let delete_query =`DELETE FROM user WHERE email='${req.query.email}'`;
        connection.query(delete_query, (err, data)=>{
            if(err)res.status(409).send(err);
            res.status(200).send("user deleted");
        })
    })
})                  

app.listen(port, () => {
  console.log("Listening....");
  connection.connect((err) => {
    if (err) throw err;
    console.log("database connected");
  });
});
