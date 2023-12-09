import React, { useState, useEffect } from "react";
import ApplicationModel from "../../models/ApplicationModel";
import UserTagCard from "./UserTagCard";
import "../../stylesheets/index.css";

const appModel = new ApplicationModel();
const UserTagPage = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await appModel.getTagsCreatedByUser();
        setTags(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div id="tagPage">
      <div id="tagHeader">
        <div id="tagTitle">{`User Tags(${tags.length})`}</div>
      </div>
      <div className="tagGridContainer">
        <div className="tagGrid">
          {tags && tags.length > 0 ? (
            tags.map((tag) => {
              return <UserTagCard key={tag.tid} tag={tag} />;
            })
          ) : (
            <div>No Tags available.</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserTagPage;
