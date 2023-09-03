const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const bcrypt = require("bcrypt");


const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const { request } = require("http");

let db=null;
let dbPath = path.join(__dirname,"reg.db");
const initalizeDbAndServer = async()=>{
try{
db = await open({
    filename:dbPath,
    driver:sqlite3.Database
})
app.listen(3011,()=>{
    console.log("Server is running at https://localhost:3011 ")
})
}
catch (e){
    console.log(`Error is ${e.message}`);
    process.exit(1)
}

}

initalizeDbAndServer();

app.get("/",async(request,response)=>{
  const myQuery = `SELECT * FROM firsttable;`;
  const myResponse = await db.all(myQuery)
  response.send(myResponse)
})

app.post("/users",async(request,response)=>{
    const {name,username,password,gender,phoneno} = request.body;
    const personQuery = `SELECT * FROM firsttable WHERE username = '${username}';`
    const personResults = await db.get(personQuery);
    
    if (personResults === undefined){
        const hashedPassword = await bcrypt.hash(password,10)
        const addQuery = `INSERT INTO firsttable (name,username,password,gender,phoneno) VALUES ('${name}','${username}','${hashedPassword}','${gender}',${phoneno});`;
        const addResponse = await db.run(addQuery)
        response.send("SUCCESSFULLY REGISTERED");
      
    }
    else{
      
      response.send("Already user exits")
      response.status(400);
      
    }
   
})



  