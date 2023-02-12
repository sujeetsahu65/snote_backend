const mongoose = require('mongoose');

const conn = ()=>{
mongoose.connect("mongodb://localhost:27017/", ()=>{
    console.log('Connected to mongo');
})
}

module.exports = conn;