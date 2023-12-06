import React from 'react';
import { formatDateDifference } from '../../Utility/dateFormatUtil';

const CommentAuthorInfo = ({ comment }) => {
  const timeDisplayText = formatDateDifference(comment.dateOfComment);

  return (
    <div id="authorAndTime">
    <div id="authorOfQuestion">{comment.author}</div>
    <div id="timeInfo">{timeDisplayText}</div>
  </div>

  );
};

export default CommentAuthorInfo;
