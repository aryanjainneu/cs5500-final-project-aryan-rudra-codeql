const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  ans_by: { type: String, required: true },
  authorid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  qid: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  ans_date_time: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
});

answerSchema.virtual("ansBy").get(function () {
  return this.ans_by;
});
answerSchema.virtual("ansDate").get(function () {
  //return this.ans_date_time;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(this.ans_date_time);
});
answerSchema.set("toJSON", { virtuals: true });
answerSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Answer", answerSchema);
