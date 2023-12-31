
const Question = require('./questions');
const Answer = require('./answers');
const Tag = require('./tags');

class ApplicationModel {
  static instance = null;

  constructor() {
    if (ApplicationModel.instance) {
      return ApplicationModel.instance;
    }
    ApplicationModel.instance = this;
  }

  static async getQuestions() {
    const questions = await Question.find({});
    return questions.map(question => question.toObject({ virtuals: true }));
  }
  static async getAnswers() {
    const answers = await Answer.find({});
    return answers.map(answer => answer.toObject({ virtuals: true }));
  }
  static async getTags() {
    return await Tag.find({});
  }
  static async addQuestion(title, text, tagsInput, askedBy, askDate) {
    const tagIds = await this.addNewTags(tagsInput); 
    return await Question.create({
      title,
      text,
      tags: tagIds,
      asked_by: askedBy, 
      ask_date_time: askDate 
    });
  }

  static async addNewTags(tagInput) {
    const tagIds = [];
    for (const tagName of tagInput) {
      let tag = await Tag.findOne({ name: { $regex: new RegExp('^' + tagName + '$', 'i') } });
      if (!tag) {
        tag = await Tag.create({ name: tagName});
      }
      tagIds.push(tag._id);
    }
    return tagIds;
  }
  

  static async addAnswer(text, author, qid, date) {
    const answer = await Answer.create({
      text,
      ans_by: author, 
      ans_date_time: date 
    });
    await Question.findByIdAndUpdate(qid, {
      $push: { answers: answer._id } 
    });
  }

  static async addTag(name) {
    let tag = await Tag.findOne({ name: name.toLowerCase() });
    if (!tag) {
      tag = await Tag.create({ name });
    }
    return tag;
  }

  static async getQuestionById(qid) {
    const question = await Question.findById(qid);
    return question ? question.toObject({ virtuals: true }) : null;
  }

  static async getAnswersForQuestion(qid) {
    try {
      const question = await Question.findById(qid)
                                      .populate({
                                          path: 'answers', 
                                          options: { sort: { 'ans_date_time': -1 } }
                                      })
                                      .exec();
  
      if (!question) {
        return [];
      }
      const answers = question.answers.map(answer => answer.toObject({ virtuals: true }));
  
      return answers;
    } catch (error) {
      console.error("Error in getAnswersForQuestion:", error);
      throw error;
    }
  }


  static async getQuestionsByTag(tid) {
    const taggedQuestions = await Question.find({ tags: tid }).sort({ ask_date_time: -1 });
    const questions =  taggedQuestions.map(question => question.toObject({ virtuals: true }));
    return await this.addTagToQuestion(questions) 
  }

  static async getNewestQuestionsFirst() {
    const questions = await Question.find({}).sort({ ask_date_time: -1 });
    return questions.map(question => question.toObject({ virtuals: true }));
  }

  static async getUnansweredQuestionsFirst() {
    const questions = await Question.find({ answers: { $size: 0 } }).sort({ ask_date_time: -1 });
    return questions.map(question => question.toObject({ virtuals: true }));
  }

  static async getActiveQuestionsFirst() {
    const mostActiveQuestions = await Question.aggregate([
      {
        $lookup: {
          from: 'answers', 
          localField: 'answers',
          foreignField: '_id',
          as: 'fetchedAnswers'
        }
      },
      {
        $addFields: {
          lastActivityDate: { $max: '$fetchedAnswers.ans_date_time' }
        }
      },
      { $sort: { lastActivityDate: -1 } },
      { $unset: 'fetchedAnswers' }
    ]).exec();

    return mostActiveQuestions.map(question => {
      const questionDoc = new Question(question);
      return questionDoc.toObject({ virtuals: true });
    });
  }

  
  

  static async incrementViewCount(questionId) {
    const question = await Question.findById(questionId);
    if (question) {
      question.views = (question.views || 0) + 1;
      await question.save();
    }
  }

  static async getQuestionsWithTags(order,questions) {

    if(!questions){
      switch (order) {
        case 'newest':
          questions = await this.getNewestQuestionsFirst();
          break;
        case 'unanswered':
          questions = await this.getUnansweredQuestionsFirst();
          break;
        case 'active':
          questions = await this.getActiveQuestionsFirst();
          break;
        default:
          throw new Error('Invalid order specified');
      }
    }
   

    const results = await this.addTagToQuestion(questions);
    return results;
  }

  static async addTagToQuestion(questions) {
    const results = await Promise.all(questions.map(async (question) => {
      const tags = await Tag.find({ _id: { $in: question.tags } }).lean();
      return {
        question:question,
        tags: tags
      };
    }));

    return results;
  }
  

  
  static async searchQuestions(query) {
    const tagPattern = /\[([^\]]+)\]/g;
    let tagNames = [];
    let match;
  
    // Function to escape special characters in regular expressions
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
  
    while ((match = tagPattern.exec(query))) {
      tagNames.push(match[1].toLowerCase());
    }
  
    const words = query.replace(tagPattern, ' ').trim().toLowerCase().split(/\s+/).filter(word => word);
  
    let searchConditions = [];
  
    if (tagNames.length) {
      // Transform each tagName into a case-insensitive regular expression
      const regexTagNames = tagNames.map(tagName => new RegExp('^' + escapeRegExp(tagName) + '$', 'i'));
  
      // Query the Tag collection to get the tag IDs
      const tags = await Tag.find({ name: { $in: regexTagNames } }).lean();
      if (tags.length > 0) {
        searchConditions.push({ tags: { $in: tags.map(tag => tag._id) } });
      }
    }
  
    if (words.length) {
      const wordConditions = words.map(word => ({
        $or: [
          { title: { $regex: `\\b${word}\\b`, $options: 'i' } },
          { text: { $regex: `\\b${word}\\b`, $options: 'i' } }
        ]
      }));
      searchConditions.push(...wordConditions);
    }

    if (searchConditions.length === 0) {
      return [];
    }
  
    const searchCriteria = searchConditions.length > 0 ? { $or: searchConditions } : {};
  
    const searchResult = await Question.find(searchCriteria).sort({ ask_date_time: -1 }).exec(); 
    return searchResult && searchResult.length > 0 
      ? await this.addTagToQuestion(searchResult) 
      : searchResult;
  }
  


  static async getTagsWithCounts() {
    const tags = await Tag.find({});
    const counts = await Promise.all(tags.map(async tag => {
      const count = await Question.countDocuments({ tags: tag._id });
      return {
        tid: tag._id,
        name: tag.name,
        count: count
      };
    }));
    return counts;
  }


  static async getTagsByIds(tagIds) {
    return await Tag.find({ _id: { $in: tagIds } });
  }
}

module.exports = ApplicationModel;
