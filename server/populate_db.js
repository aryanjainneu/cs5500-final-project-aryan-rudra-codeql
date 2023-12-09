const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('./models/user'); 
const Question = require('./models/questions'); 
const Answer = require('./models/answers'); 
const Comment = require('./models/comment'); 
const Tag = require('./models/tags'); 



// MongoDB connection
let mongoDB = process.argv[2];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const loremIpsumTech = 'Technology is constantly evolving, leading to new innovations and discoveries in computing, AI, and software development. '.repeat(10);


function randomDateInPast10Years() {
    const today = new Date();
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  
    return new Date(tenYearsAgo.getTime() + Math.random() * (today.getTime() - tenYearsAgo.getTime()));
  }
  
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

async function createUser(username, email, password) {
  let hashedPassword = await bcrypt.hash(password, 10);
  let user = new User({ username, email, password: hashedPassword, reputation: 50,dateOfAccountCreation:randomDateInPast10Years() }); // Ensure 50 reputation
  return user.save();
}

async function createComment(text, user, afterDate) {
    let commentText = text.length > 140 ? text.substring(0, 137) + '...' : text; // Limit to 140 characters
    let commentDate = new Date(afterDate.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 24)); // Adding 0-24 hours to the afterDate
    let comment = new Comment({ text: commentText, authorid: user._id, author: user.username, votes: Math.ceil(Math.random() * 100), dateOfComment: commentDate }); // Ensure positive vote
    return comment.save();
}
  

async function createAnswer(text, user, question) {
    let answerText = text.padEnd(400, ' '); // Ensure at least 400 characters
    let answerDate = new Date(question.ask_date_time.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 24)); // Adding 0-24 hours to question's createdAt
    let comments = [];
    for (let i = 0; i < Math.floor(Math.random() * 6) + 5; i++) { // 5-10 comments
      comments.push(await createComment(`Answer Comment ${i}`, user, answerDate));
    }
  
    let answer = new Answer({
      text: answerText,
      ans_by: user.username,
      authorid: user._id,
      qid: question._id,
      comments,
      votes: Math.ceil(Math.random() * 100), // Ensure positive vote
      ans_date_time : answerDate
    });
  
    return answer.save();
  }
  
  


  async function createQuestion(title, text, user) {
    let tags = [];
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) { // 1-5 tags
      tags.push(await createTag(`Tag ${i}`));
    }
  
    // Generate question creation date
    let questionDate = randomDateInPast10Years();
    let questionText = text.padEnd(400, ' ');
    let questionTitle = title.padEnd(200, ' ');
  
    let question = new Question({
      title: questionTitle,
      text: questionText,
      tags,
      asked_by: user.username,
      authorid: user._id,
      views: Math.ceil(Math.random() * 100),
      votes: Math.ceil(Math.random() * 100),
      ask_date_time: questionDate
    });
    let savedQuestion = await question.save();
  
    // Create comments for the question with dates later than the question's creation date
    let comments = [];
    for (let i = 0; i < Math.floor(Math.random() * 6) + 5; i++) { // 5-10 comments
      comments.push(await createComment(`Question Comment ${i}`, user, questionDate));
    }
  
    // Update the question with comments
    await Question.findByIdAndUpdate(savedQuestion._id, { $set: { comments: comments } });
  
    // Create answers for the question with dates later than the question's creation date
    let answers = [];
    let latestDate = questionDate; // Initialize with question's creation date
    for (let i = 0; i < Math.floor(Math.random() * 6) + 5; i++) { // 5-10 answers
      let answer = await createAnswer(`Answer ${i}`, user, savedQuestion, questionDate);
      answers.push(answer._id);
      if (answer.ans_date_time > latestDate) {
        latestDate = answer.ans_date_time;
      }
    }
  
    // Update the question with the generated answers and latest activity date
    await Question.findByIdAndUpdate(savedQuestion._id, { $set: { answers: answers, latestActivity: latestDate } }, { new: true });
  
    // Update user's qids array
    await User.findByIdAndUpdate(user._id, { $push: { qids: savedQuestion._id } });
  
    return savedQuestion;
  }

// Updated populate function
async function populate() {
  try {
    // Create users
    for (let i = 0; i < 5; i++) {
      await createUser(`User${i}`, `user${i}@example.com`, 'password123');
    }

    // Create 5 questions
    for (let i = 0; i < 5; i++) {
      const user = await User.findOne({ username: `User${i % 5}` });
      await createQuestion(`Question Title ${i} with a very long and descriptive title covering technology and software development`, loremIpsumTech, user);
    }

    console.log('Database populated!');
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    db.close();
  }
}

populate();
