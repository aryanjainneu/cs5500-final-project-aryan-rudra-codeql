const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfAccountCreation: { type: Date, default: Date.now },
  reputation: { type: Number, default: 0 },
  qids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  ansIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  tids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
});

userSchema.statics.loginUser = async function(username, password) {
  const user = await this.findOne({ username }, {qids: 0, ansIds: 0, tids: 0 }).lean(); 
  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  delete user.password; 
  return user;
};

module.exports = mongoose.model('User', userSchema);
