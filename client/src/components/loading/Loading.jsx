import React from "react";

const Loading = (props) => {
  return (
    <div
      className={`flex ${props.color} gap-2 border border-gray-200 mt-3 text-black py-[5px] px-4 items-center justify-center rounded-sm`}
    >
      <div className="loader"></div>
      <p className="font-semibold">Loading...</p>
    </div>
  );
};

export default Loading;
