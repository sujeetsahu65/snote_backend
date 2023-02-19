const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
    user:{
type: mongoose.Schema.Types.ObjectId, //here we are using ObjectId as foreign key
ref:'User' //here the reference of OjbectId which is there in the 'User model'
    },
title:{
    type: String,
    required: true
},
description:{
    // type: String,
    type: mongoose.Schema.Types.Mixed,
     required: true,
},
tag:{
    type: String
},
date:{
    type: Date,
     default: Date.now,
     
}
});

module.exports = mongoose.model('notes',NotesSchema)