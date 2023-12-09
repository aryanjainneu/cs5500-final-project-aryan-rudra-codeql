const express = require("express");
const router = express.Router();
const ApplicationController = require("./Controller/ApplicationController");

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).send("User not authenticated");
};

// GET all questions
router.get("/questions", ApplicationController.getQuestions);

// User Login
router.post("/login", ApplicationController.login);

//User logout
router.post("/logout", isAuthenticated, ApplicationController.logout);

// POST a new question
router.post("/questions", isAuthenticated, ApplicationController.addQuestion);

//Register a new user
router.post("/register", ApplicationController.addUser);

// GET questions by tag ID
router.get("/questions/tag/:tid", ApplicationController.getQuestionsByTag);

// GET a single question by ID
router.get("/questions/:qid", ApplicationController.getQuestionById);

// GET answers for a question
router.get(
  "/questions/:qid/answers",
  ApplicationController.getAnswersForQuestion
);

router.get(
  "/questions/questionwithtags/:order",
  ApplicationController.getQuestionWithTags
);

router.get(
  "/user/questionwithtags/",isAuthenticated,
  ApplicationController.getQuestionsWithTagsForCurrentUser
);
router.get(
  "/user/answers/",isAuthenticated,
  ApplicationController.getAnswersGivenByUser
);

router.get(
  "/user/tags/",isAuthenticated,
  ApplicationController.getTagsCreatedByUser
);

// POST a new answer
router.post("/answers", isAuthenticated, ApplicationController.addAnswer);

// GET tags with counts
router.get("/tags", ApplicationController.getTagsWithCounts);

// GET active questions first
router.get("/questions/active", ApplicationController.getActiveQuestionsFirst);

// GET newest questions first
router.get("/questions/newest", ApplicationController.getNewestQuestionsFirst);

// GET unanswered questions
router.get(
  "/questions/unanswered",
  ApplicationController.getUnansweredQuestionsFirst
);

// POST a new tag
// router.post('/tags', ApplicationController.addTag);

// PUT to increment view count for a question
router.put(
  "/questions/:qid/views",
  isAuthenticated,
  ApplicationController.incrementViewCount
);

// GET search questions
router.get("/search", ApplicationController.searchQuestions);

// The following routes are additional and correspond to the remaining methods in ApplicationModel

// GET questions with their associated tags
router.get("/questions/tags", ApplicationController.getQuestionsWithTags);

// GET tags by ID - Assuming you have an endpoint that requires fetching tags by their IDs
router.post("/tags/ids", isAuthenticated, ApplicationController.getTagsByIds);

router.get("/question/comments", ApplicationController.getCommentsByQid);

router.post(
  "/answer/comments",
  isAuthenticated,
  ApplicationController.postCommentForAnsId
);
router.post(
  "/question/comments",
  isAuthenticated,
  ApplicationController.postCommentForQid
);

router.get("/answer/comments", ApplicationController.getCommentsByAnsId);

router.put("/comment/upvote", ApplicationController.updateCommentVoteCount);

router.put(
  "/question/updatevotecount",
  ApplicationController.updateQuestionVoteCount
);

router.put(
  "/answer/updatevotecount",
  ApplicationController.updateAnswerVoteCount
);

module.exports = router;
