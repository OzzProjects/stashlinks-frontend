const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { Client, Pool } = require('pg');
const pool = new Pool({
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
  console.log("returned response: "+response);
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
    console.log("The data callback "+data);
    return data;
  }
  console.log("The error callback "+data);
  return null;

}

function getDataDatabase(callback){

  var response="";

  // the pool will emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  const text = 'SELECT link FROM links'
 
  // callback - checkout a client
  pool.connect((err, client, done) => {

    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }

    client.query(text, (err, res) => {
      done()
      if (err) {
        console.log("Failed:")
        console.log(err.stack)
        return callback(null);
      } else {
        console.log("Succeded:")
        console.log(res.rows[0])
        return callback(res.rows[0]);
      }
    })
  });


};



app.listen(port);
