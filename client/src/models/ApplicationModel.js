import axios from "axios";
class ApplicationModel {
  static instance;
  constructor() {
    if (ApplicationModel.instance) {
      return ApplicationModel.instance;
    }
    this.api = axios.create({
      baseURL: "http://localhost:8000/api",
      withCredentials: true,
    });

    ApplicationModel.instance = this;
  }

  async getQuestions() {
    try {
      const response = await this.api.get("/questions");
      return response.data;
    } catch (error) {
      console.error("Error fetching question", error);
      throw error;
    }
  }

  async addQuestion(title, text, tagsInput, askDate) {
    try {
      const response = await this.api.post("/questions", {
        title,
        text,
        tagsInput,
        askDate,
      });
      return response.data;
    } catch (error) {
      console.error("Error Posting New Question", error);
      throw error;
    }
  }

  async addAnswer(text, qid, date) {
    try {
      const answerData = {
        text: text,
        qid: qid,
        ansDate: date,
      };
      await this.api.post("/answers", answerData);
    } catch (error) {
      console.error("Error Posting new answer:", error);
      throw error;
    }
  }

  async getQuestionById(qid) {
    try {
      const response = await this.api.get(`/questions/${qid}`);
      response.data.askDate = new Date(response.data.askDate);
      return response.data;
    } catch (error) {
      console.error("Error fetching question using id", error);
      throw error;
    }
  }

  async getAnswersForQuestion(qid, page = 1, limit = 5) {
    //const response = await this.api.get(`/questions/${qid}/answers`);
    try {
      const response = await this.api.get(`/questions/${qid}/answers`, {
        params: { page, limit },
      });
      const answers = response.data.answers.map((answer) => {
        const ansDateConverted = new Date(answer.ansDate);
        if (isNaN(ansDateConverted.getTime())) {
          throw new Error(`Invalid date string received: ${answer.ansDate}`);
        }
        return {
          ...answer,
          ansDate: ansDateConverted,
        };
      });

      return {
        answers: answers,
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error("Error fetching questions with tags:", error);
      throw error;
    }
  }

  async getQuestionsByTag(tid) {
    try {
      const response = await this.api.get(`/questions/tag/${tid}`);
      const result = this.convertDateStringToDate(response);
      return result;
    } catch (error) {
      console.error("Error fetching question by tag id ", error);
      throw error;
    }
  }

  async getNewestQuestionsFirst() {
    try {
      const response = await this.api.get("/questions/newest");
      return response.data;
    } catch (error) {
      console.error("Error fetching question in newest order", error);
      throw error;
    }
  }

  async getUnansweredQuestionsFirst() {
    try {
      const response = await this.api.get("/questions/unanswered");
      return response.data;
    } catch (error) {
      console.error("Error fetching question in unanswered order", error);
      throw error;
    }
  }

  async incrementViewCount(qid) {
    try {
      const response = await this.api.put(`/questions/${qid}/views`);
      return response.data;
    } catch (error) {
      console.error("Error incrementing question views", error);
      throw error;
    }
  }

  async updateCommentVoteCount(cid, votes) {
    try {
      const response = await this.api.put(`/comment/upvote`, {
        params: { cid, votes },
      });
      return response.data;
    } catch (error) {
      console.error("Error incrementing comment votes", error);
      throw error;
    }
  }

  async updateQuestionVoteCount(qid, deltaRep, deltaVote) {
    try {
      const response = await this.api.put(`question/updatevotecount`, {
        params: { qid, deltaRep, deltaVote },
      });
      return response.data;
    } catch (error) {
      console.error("Error incrementing question votes", error);
      throw error;
    }
  }

  async updateAnswerVoteCount(aid, deltaRep, deltaVote) {
    try {
      const response = await this.api.put(`/answer/updatevotecount`, {
        params: { aid, deltaRep, deltaVote },
      });
      return response.data;
    } catch (error) {
      console.error("Error incrementing answer views", error);
      throw error;
    }
  }

  async getActiveQuestionsFirst() {
    try {
      const response = await this.api.get("/questions/active");
      return response.data;
    } catch (error) {
      console.error("Error fetching question in active order", error);
      throw error;
    }
  }

  async searchQuestions(query,order,page,limit) {
    try {
      const response = await this.api.get("/search", { params: { q: query,order,page,limit } });
      const searchResult = this.convertQuestionDateStringToDate(
        response.data.questions
      );
      
      return {
        questions: searchResult,
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error("Error fetching search results", error);
      throw error;
    }
  }

  async getTagsWithCounts() {
    try {
      const response = await this.api.get("/tags");
      return response.data;
    } catch (error) {
      console.error("Error fetching tag with associated question count", error);
      throw error;
    }
  }

  // async getQuestionsWithTags(filter) {
  //   try {
  //     const response = await this.api.get(`/questions/questionwithtags/${filter}`);
  //     const questionsWithDates = this.convertDateStringToDate(response);

  //     return questionsWithDates;
  //   } catch (error) {
  //     console.error('Error fetching questions with tags:', error);
  //     throw error;
  //   }
  // }

  async getQuestionsWithTags(filter, page = 1, limit = 5) {
    try {
      const response = await this.api.get(
        `/questions/questionwithtags/${filter}`,
        {
          params: { page, limit },
        }
      );
      const questionsWithDates = this.convertQuestionDateStringToDate(
        response.data.questions
      );

      // Include the total number of questions and any other metadata returned by the API
      return {
        questions: questionsWithDates,
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error("Error fetching questions with tags:", error);
      throw error;
    }
  }

  async getCommentsForQuestion(qid, page = 1, limit = 5) {
    try {
      const response = await this.api.get(`/question/comments`, {
        params: { qid, page, limit },
      });
      const commentsWithDates = response.data.comments.map((item) => {
        const askDateConverted = new Date(item.dateOfComment);
        if (isNaN(askDateConverted.getTime())) {
          throw new Error(
            `Invalid date string received: ${item.question.askDate}`
          );
        }
        return {
          ...item,
          dateOfComment: askDateConverted,
        };
      });

      // Include the total number of questions and any other metadata returned by the API
      return {
        comments: commentsWithDates,
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error("Error fetching comment for question", error);
      throw error;
    }
  }

  async getCommentsForAnswer(aid, page = 1, limit = 5) {
    try {
      const response = await this.api.get(`/answer/comments`, {
        params: { aid, page, limit },
      });
      const commentsWithDates = response.data.comments.map((item) => {
        const askDateConverted = new Date(item.dateOfComment);
        if (isNaN(askDateConverted.getTime())) {
          throw new Error(
            `Invalid date string received: ${item.question.askDate}`
          );
        }
        return {
          ...item,
          dateOfComment: askDateConverted,
        };
      });

      // Include the total number of questions and any other metadata returned by the API
      return {
        comments: commentsWithDates,
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error("Error fetching comment answer", error);
      throw error;
    }
  }
  convertQuestionDateStringToDate(questions) {
    const questionsWithDates = questions.map((item) => {
      const askDateConverted = new Date(item.question.askDate);
      if (isNaN(askDateConverted.getTime())) {
        throw new Error(
          `Invalid date string received: ${item.question.askDate}`
        );
      }
      return {
        ...item,
        question: {
          ...item.question,
          askDate: askDateConverted,
        },
      };
    });
    return questionsWithDates;
  }

  convertDateStringToDate(response) {
    const questionsWithDates = response.data.map((item) => {
      const askDateConverted = new Date(item.question.askDate);
      if (isNaN(askDateConverted.getTime())) {
        throw new Error(
          `Invalid date string received: ${item.question.askDate}`
        );
      }
      return {
        ...item,
        question: {
          ...item.question,
          askDate: askDateConverted,
        },
      };
    });
    return questionsWithDates;
  }

  async getTagsByIds(tagIds) {
    try {
      const response = await this.api.post("/tags/ids", { tagIds });
      return response.data;
    } catch (error) {
      console.error("Error fetching tag object given tagids", error);
      throw error;
    }
  }

  async registerUser(username, email, password) {
    try {
      const response = await this.api.post("/register", {
        username,
        email,
        password,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Registration failed:", error.response.data);
      return {
        success: false,
        error: error.response.data.message || "Registration failed",
      };
    }
  }

  async login(username, password) {
    try {
      const response = await this.api.post("/login", { username, password });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response.data.message || "login failed",
      };
    }
  }

  async logout() {
    try {
      const response = await this.api.post("/logout");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response.data.message || "logout failed",
      };
    }
  }

  async postCommentForAnswer(text, author, ansId) {
    try {
      const response = await this.api.post("/answer/comments", {
        text,
        author,
        ansId,
      });
      response.data.comment = this.convertCommentDateStringToDate(
        response.data.comment
      );
      return response.data;
    } catch (error) {
      console.error("Error posting comment for answer", error);
      throw error;
    }
  }

  convertCommentDateStringToDate(item) {
    const askDateConverted = new Date(item.dateOfComment);
    if (isNaN(askDateConverted.getTime())) {
      throw new Error(`Invalid date string received: ${item.dateOfComment}`);
    }
    return {
      ...item,
      dateOfComment: askDateConverted,
    };
  }

  async postCommentForQuestion(text, author, qid) {
    try {
      const response = await this.api.post("/question/comments", {
        text,
        author,
        qid,
      });
      response.data.comment = this.convertCommentDateStringToDate(
        response.data.comment
      );
      return response.data;
    } catch (error) {
      console.error("Error posting comment for question", error);
      throw error;
    }
  }
}

export default ApplicationModel;
