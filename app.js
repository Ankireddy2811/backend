const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());


const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
// const { request } = require("http");

let db=null;
let dbPath = path.join(__dirname,"users.db");
const initalizeDbAndServer = async()=>{
try{
db = await open({
    filename:dbPath,
    driver:sqlite3.Database
})
app.listen(3011,()=>{
    console.log("Server is running at https://localhost:3011/")
})
}
catch (e){
    console.log(`Error is ${e.message}`);
    process.exit(1)
}

}

initalizeDbAndServer()

app.get("/",async(request,response)=>{
  const myQuery = `SELECT * FROM usersInfo;`;
  const myResponse = await db.all(myQuery)
  response.send(myResponse)
})

app.post("/users",async(request,response)=>{
    const {name,email,imageurl} = request.body;
    const addQuery = `INSERT INTO usersInfo (name,email,imageurl) VALUES ('${name}','${email}','${imageurl}');`;
    const addRespose = await db.run(addQuery)
    response.send("user details added successfully")
}) 

app.put("/users/:id",async(request,response)=>{
    const {id} = request.params
    const {name,email,imageurl} = request.body;
    const updateQuery = `UPDATE usersInfo SET name = '${name}',email= '${email}',imageurl='${imageurl}' WHERE id=${id};`;
    const updateRespose = await db.run(updateQuery )
    response.send("user details updated successfully")
}) 

app.delete("/users/:id",async(request,response)=>{
    const {id} = request.params
    const deleteQuery = `DELETE FROM usersInfo WHERE id=${id}`
    await db.run(deleteQuery)
    response.send("user details deleted successfuuly")
})


  