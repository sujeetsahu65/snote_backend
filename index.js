const conn = require('./db');
const express = require('express');
conn();

const app = express()
const port = 5000


app.use(express.json());//if we want to use request-body(in the auth endpoint)
// app.setHeader("application/x-www-form-urlencoded");

var cors = require('cors');

// use it before all route definitions
app.use(cors({origin: 'http://localhost:5000'}));

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })


// available routes(we are making api endpoints here)
app.use('/api/auth',require('./routes/auth'));
// http://localhost:3000/api/auth 

app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})