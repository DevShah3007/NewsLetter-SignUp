const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  const data ={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields : {
          FNAME : fName,
          LNAME : lName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/c1f7d6df4d";
  const options = {
    method: "POST",
    auth:"dev:f1059322ee16a385497e68492415d3dc-us20"
  }

  const request = https.request(url,options,function(response){
    if(response.statusCode === 200)
    {
      res.sendFile(__dirname + "/success.html");
    }
    else
    {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
})

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Server listening...");
})
