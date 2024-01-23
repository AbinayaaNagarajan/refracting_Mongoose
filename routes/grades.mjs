import express from 'express';
//import db from '../db/connection.mjs';
//import { ObjectId } from 'mongodb';
import mongoose from "mongoose";

const router = express.Router();

// Mongoose Model
const Grade = mongoose.model('Grade', {
  // Define your schema here
  learner_id: Number,
  // Other fields...
});

await mongoose.connect(process.env.ATLAS_URI);

// Query collection middleware
// router.use(async (req, res, next) => {
//     req.grades = await db.collection('grades');
//     next();
//   });

  // Middleware for handling Mongoose model
router.use((req, res, next) => {
  req.Grade = Grade;
  next();
});

  
  //BASE URL
  // localhost:5050/grades/
  
  /*    "/grades" routes    */
  // These are routes that interact with single grade entries
  ////////////////////////////////////////////
  // Create a single grade entry
  // router.post('/', async (req, res) => {
  //   let collection = req.grades;
  //   let newDocument = req.body;
  
  //   // rename fields for backwards compatibility
  //   if (newDocument.hasOwnProperty('student_id')) {
  //     newDocument.learner_id = newDocument.student_id;
  //     delete newDocument.student_id;
  //   }
  
  //   let result = await collection.insertOne(newDocument);
  //   if (!result) res.send('Bad Request').status(400);
  //   else res.send(result).status(200);
  // });
  

// Create a single grade entry using Mongoose
router.post('/', async (req, res) => {
  try {
    const newGrade = new Grade(req.body);
    const result = await newGrade.save();
    res.send(result).status(200);
  } catch (error) {
    res.send('Bad Request').status(400);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await Grade.findById(req.params.id);
    if (!result) res.send('Not Found').status(404);
    else res.send(result).status(200);
  } catch (error) {
    res.send('Not Found').status(404);
  }
});

  //Get a single grade entry
  // router.get('/:id', async (req, res) => {
  //   let collection = req.grades;
  //   let query = { _id: new ObjectId(req.params.id) };
  //   let result = await collection.findOne(query);
  
  //   if (!result) res.send('Not Found').status(404);
  //   else res.send(result).status(200);
  // });
  
  // Add a score to a grade entry
  router.patch('/:id/add', async (req, res) => {
    let collection = req.grades;
    let query = { _id: new ObjectId(req.params.id) };
  
    let result = await collection.updateOne(query, {
      $push: { scores: req.body },
    });
  
    if (!result) res.send('Not found').status(404);
    else res.send(result).status(200);
  });
  
  // Remove a score from a grade entry
  router.patch('/:id/remove', async (req, res) => {
    let collection = req.grades;
    let query = { _id: new ObjectId(req.params.id) };
  
    let result = await collection.updateOne(query, {
      $pull: { scores: req.body },
    });
  
    if (!result) res.send('Not found').status(404);
    else res.send(result).status(200);
  });
  
  // Delete a single grade entry
  router.delete('/:id', async (req, res) => {
    let collection = req.grades;
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.deleteOne(query);
  
    if (!result) res.send('Not found').status(404);
    else res.send(result).status(200);
  });
  ////////////////////////////////////////////
  
  /*    "/grades/learner" routes    */
  // These are routes that interact with grade entries based on learner_id
  ////////////////////////////////////////////
  // Get route for backwards compatibility
  router.get('/student/:id', (req, res) => {
    res.redirect(`/learner/${req.params.id}`);
  });
  
  // Get a students grade data
  // Get a student's grade data
router.get('/learner/:id', async (req, res) => {
  try {
    const Grade = req.Grade; // Using the Mongoose model from middleware
    const query = { learner_id: Number(req.params.id) };

    const result = await Grade.find(query);
  
    if (!result || result.length === 0) {
      res.send('Not Found').status(404);
    } else {
      res.send(result).status(200);
    }
  } catch (error) {
    console.error(error);
    res.send('Internal Server Error').status(500);
  }
});

  
  // Delete a learner's grade data
  router.delete('/learner/:id', async (req, res) => {
    let collection = req.grades;
    let query = { learner_id: Number(req.params.id) };
  
    let result = await collection.deleteOne(query);
  
    if (!result) res.send('Not found').status(404);
    else res.send(result).status(200);
  });
  ////////////////////////////////////////////
  
  /*    "/grades/class" routes    */
  // These are routes that interact with grade entries based on class_id
  ////////////////////////////////////////////
  // Get a class's grade data
router.get('/class/:id', async (req, res) => {
  try {
    const Grade = req.Grade;
    const query = { class_id: Number(req.params.id) };
    const result = await Grade.find(query);

    if (!result || result.length === 0) {
      res.send('Not Found').status(404);
    } else {
      res.send(result).status(200);
    }
  } catch (error) {
    console.error(error);
    res.send('Internal Server Error').status(500);
  }
});
  
// Update a class id
router.patch('/class/:id', async (req, res) => {
  try {
    const Grade = req.Grade;
    const query = { class_id: Number(req.params.id) };
    const result = await Grade.updateMany(query, {
      $set: { class_id: req.body.class_id },
    });

    if (!result) res.send('Not found').status(404);
    else res.send(result).status(200);
  } catch (error) {
    console.error(error);
    res.send('Internal Server Error').status(500);
  }
});
  
  // Delete a class
router.delete('/class/:id', async (req, res) => {
  try {
    const Grade = req.Grade;
    const query = { class_id: Number(req.params.id) };
    const result = await Grade.deleteMany(query);

    if (!result) res.send('Not found').status(404);
    else res.send(result).status(200);
  } catch (error) {
    console.error(error);
    res.send('Internal Server Error').status(500);
  }
});
  ////////////////////////////////////////////
  
  export default router;