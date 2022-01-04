const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.STASH_DB_FRONTEND_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 5000;
}

app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
  console.log('Server Logging...')
  next();
})

/** Middleware functions that handles xurl-encoded data (form data) and parse data to json */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/script',function(req,res,next){

  console.log('Request message: ' + req.body);

  var response= getDataDatabase(returnData);
  if(response === ""|| response == null){
    res.status(404).send({data:'Database error'});
  }
  else
  {
     res.status(200).send({data:response});
  }
});

function returnData(data){
  if(data!=null){
    return data;
  }
  return null;

}

function getDataDatabase(callback){

  var response="";

  client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  });

  const text = 'SELECT link FROM links'

  client.query(text, (err, res) => {
    if (err) {
      console.log("Failed:")
      console.log(err.stack)
      response= null;
      callback(null);
    } else {
      console.log("Succeded:")
      console.log(res.rows[0])    
      response=res.rows[0];
      callback(res.rows[0]);
    }

    client.end(err => {
      console.log('client has disconnected')
      if (err) {
        console.log('error during disconnection', err.stack)
      }
    })
  })


  console.log("Final response:"+response);
  return response;

};



app.listen(port);
