const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  asked_by: { type: String, required: true },
  authorid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ask_date_time: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  votes: { type: Number, default: 0 }
});

questionSchema.virtual('tagIds').get(function() {
  return this.tags;
});
questionSchema.virtual('ansIds').get(function() {
  return this.answers;
});
questionSchema.virtual('askedBy').get(function() {
  return this.asked_by;
});
questionSchema.virtual('askDate').get(function() {
  // return this.ask_date_time;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric'
  }).format(this.ask_date_time);
});
questionSchema.set('toJSON', { virtuals: true });
questionSchema.set('toObject', { virtuals: true });

  

module.exports = mongoose.model('Question', questionSchema);
