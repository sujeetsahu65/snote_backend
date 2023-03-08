const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const { findById } = require('../models/User');


// ROUTE 1) FETCHING ALL NOTES
router.get("/fetchnotes", fetchuser, async (req, res) =>
{

    const notes = await Notes.find({ user: req.user.id });
    res.json({ notes });
});


// ROUTE 2) CREATING NOTES

router.post("/createnotes", fetchuser, [body('title', 'title must be atleast 2 char long').isLength({ min: 2 }), body('description', "description must be atleast 2 char long").isLength({ min: 2 })], async (req, res) =>
{
    const errors = validationResult(req);
    const { title, description, tag } = req.body;
    if (!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    try
    {
        // const notes = await Notes.save(req.body);
        // or 

        const notes = new Notes({
            user: req.user.id,
            title: title,
            description: description,
            tag: tag
        });
        const savedNote = await notes.save();

        // res.json({ savedNote });

        if (notes)
        {
            res.status(200).send("Note has been saved successfully");
        }
        // res.status(200).json(savedNote);

    } catch (error)
    {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

});

// ROUTE 3) UPDATING NOTES

router.put("/updatenotes/:id", fetchuser, async (req, res) =>
{
    //    const errors = validationResult(req);
    //   for now we are not using validation as the user can could update specific field instead all(though we can use validation to only updating fields)
    const { title, description, tag } = req.body;
    //  if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    try
    {
        const newNote = {};
        if (title)
        {
            newNote.title = title
        }
        if (description)
        {
            newNote.description = description
        }
        if (tag)
        {
            newNote.tag = tag
        }

        // const notes = Notes.findByIdAndUpdate(req.user.id,newNote);
        // But note that the accessing-user is valid but we need to make sure that the this user is accessing the the note which belongs to this only so for this--

        /*
               let note = await Notes.findById(req.params.id);
                if(!note){
                  return   res.status(404).send('Note not found');
                }
        
                if(note.user.toString() !== req.user.id){
          return res.status(404).send('Not Allowed');
                }
        
        */

        // or even more relevent --

        // let note = await Notes.findById(req.params.id).where({ user: req.user.id });
        // note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        // or 
        let note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }).where({ user: req.user.id });

        if (!note)
        {
            return res.status(404).send('Note not found');
        }

        res.json({ note });

    } catch (error)
    {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

});


// ROUTE 4) DELETING NOTES

router.delete("/deletenotes/:id", fetchuser, async (req, res) =>
{
    //    const errors = validationResult(req);
    try
    {
        let note = await Notes.findByIdAndDelete(req.params.id).where({ user: req.user.id });

        if (!note)
        {
            return res.status(404).send('Note not found');
        }

        // res.json({"success":"Successfully Deleted", note:note});
        res.status(200).send('Successfully Deleted');

    } catch (error)
    {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

});

module.exports = router;