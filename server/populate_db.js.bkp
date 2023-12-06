const mongoose = require('mongoose');
const Tag = require('./models/tags');
const Answer = require('./models/answers');
const Question = require('./models/questions');
const Comment = require('./models/comment');

let mongoDB = process.argv[2];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function createTag(name) {
  let tag = new Tag({ name });
  return tag.save();
}

async function createComment(text, author) {
  let comment = new Comment({ text, author });
  return comment.save();
}

async function createAnswer(text, ans_by) {
  let comments = [];
  for (let i = 0; i < 10; i++) {
    comments.push(await createComment(`Answer Comment ${i}`, `Commenter ${i}`));
  }

  let answer = new Answer({ text, ans_by, comments });
  return answer.save();
}

async function createQuestion(title, text, asked_by) {
  let tags = [];
  for (let i = 0; i < Math.floor(Math.random() * 4) + 2; i++) { // 2-5 tags
    tags.push(await createTag(`Tag ${i}`));
  }

  let answers = [];
  for (let i = 0; i < 15; i++) { // 15 answers
    answers.push(await createAnswer(`Answer ${i}`, `Answerer ${i}`));
  }

  let comments = [];
  for (let i = 0; i < 15; i++) { // 15 comments
    comments.push(await createComment(`Question Comment ${i}`, `Commenter ${i}`));
  }

  let question = new Question({ title, text, tags, answers, comments, asked_by });
  return question.save();
}

async function populate() {
  for (let i = 0; i < 5; i++) { // 5 questions
    await createQuestion(`Question Title ${i}`, `Question Text ${i}`, `Asker ${i}`);
  }

  db.close();
  console.log('Database populated!');
}

populate().catch((err) => {
  console.error('ERROR:', err);
  db.close();
});

console.log('Populating database...');
