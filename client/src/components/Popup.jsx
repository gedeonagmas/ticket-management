import React from "react";
import Pop from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const Popup = ({content,trigger}) => {
  return (
    <Pop trigger={trigger} position="right center">
      {
        <div>
          <p className="">Are you sure? this action is can not be undone</p>
          {content}
        </div>
      }
    </Pop>
  );
};

export default Popup;
