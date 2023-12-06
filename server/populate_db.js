const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('./models/user'); // Update with correct path
const Question = require('./models/questions'); // Update with correct path
const Answer = require('./models/answers'); // Update with correct path
const Comment = require('./models/comment'); // Update with correct path
const Tag = require('./models/tags'); // Update with correct path

// MongoDB connection
let mongoDB = process.argv[2];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Template text (Latin paragraph)
const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '.repeat(10); // Repeat to ensure at least 500 characters

// Function to create Tag
async function createTag(name) {
    let tag = new Tag({ name });
    const savedTag = await tag.save();
  
    // Randomly select a user and associate the tag with this user
    const randomUser = await User.aggregate([{ $sample: { size: 1 } }]);
    if (randomUser.length > 0) {
      await User.findByIdAndUpdate(randomUser[0]._id, { $push: { tids: savedTag._id } });
    }
  
    return savedTag;
}

// Function to create User
async function createUser(username, email, password) {
  let hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
  let user = new User({ username, email, password: hashedPassword });
  return user.save();
}

// Function to create Comment
async function createComment(text, user) {
  let comment = new Comment({ text, authorid: user._id,author:user.username });
  return comment.save();
}

// Function to create Answer
async function createAnswer(text, ans_by, user, question) {
    let comments = [];
    for (let i = 0; i < 10; i++) {
      comments.push(await createComment(`Answer Comment ${i}`, user));
    }
  
    let answer = new Answer({ text: loremIpsum, ans_by, authorid: user._id, comments, questionid: question._id });
    const savedAnswer = await answer.save();
  
    // Update user's ansIds array
    await User.findByIdAndUpdate(user._id, { $push: { ansIds: savedAnswer._id } });
  
    return savedAnswer;
}

// Function to create Question
async function createQuestion(title, text, asked_by, user) {
    let tags = [];
    for (let i = 0; i < Math.floor(Math.random() * 4) + 2; i++) {
        tags.push(await createTag(`Tag ${i}`));
    }

    let comments = [];
    for (let i = 0; i < 15; i++) {
        comments.push(await createComment(`Question Comment ${i}`, user));
    }

    let question = new Question({ 
        title, 
        text: loremIpsum, 
        tags, 
        comments, 
        asked_by, 
        authorid: user._id,
        views: Math.ceil(Math.random() * 100), // Random positive views
        votes: Math.ceil(Math.random() * 100)  // Random positive votes
    });
    let savedQuestion = await question.save();

    // Update user's qids array
    let answers = [];
    for (let i = 0; i < 15; i++) {
        let answer = await createAnswer(`Answer ${i}`, `Answerer ${i}`, user, savedQuestion);
        answers.push(answer._id);
    }

    // Update the question with the generated answers
    await Question.findByIdAndUpdate(savedQuestion._id, { $set: { answers: answers } }, { new: true });

    // Update user's qids array
    await User.findByIdAndUpdate(user._id, { $push: { qids: savedQuestion._id } });

    return savedQuestion;
}

// Function to populate the database
async function populate() {
    try {
      // Create a set of users first
      for (let i = 0; i < 10; i++) {
        await createUser(`User${i}`, `user${i}@example.com`, 'password123');
      }
  
      // Now create 40 questions (and associated tags, answers, comments)
      for (let i = 0; i < 40; i++) {
        const userIndex = i % 10; // To cycle through the 10 users
        const user = await User.findOne({ username: `User${userIndex}` });
        await createQuestion(`Question Title ${i}`, loremIpsum, `Asker ${userIndex}`, user);
      }
  
      console.log('Database populated!');
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        db.close();
    }
}

populate();
