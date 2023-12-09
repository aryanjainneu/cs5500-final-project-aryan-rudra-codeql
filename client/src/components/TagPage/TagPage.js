import TagHeader from "./TagHeader";
import React, { useState, useEffect } from "react";
import ApplicationModel from "../../models/ApplicationModel";
import TagCard from "./TagCard";
import "../../stylesheets/index.css";

const appModel = new ApplicationModel();
const TagPage = ({ handleAskQuestionClick, handleTagCardClick }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await appModel.getTagsWithCounts();
        setTags(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div id="tagPage">
      <TagHeader tags={tags} handleAskQuestionClick={handleAskQuestionClick} />
      <div className="tagGridContainer">
        <div className="tagGrid">
          {tags && tags.length > 0 ? (
            tags.map((tag) => {
              return (
                <TagCard
                  key={tag.tid}
                  tag={tag}
                  handleTagCardClick={handleTagCardClick}
                />
              );
            })
          ) : (
            <div>No Tags available.</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TagPage;
