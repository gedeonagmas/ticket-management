import React from "react";

const ChatHeader = ({ user, onlineUsers }) => {
  return (
    <div className="w-full relative py-[4px] bg-gray-200 bg-dark flex border-b border-dark justify-between items-center">
      <div
        onClick={() => {
          const id = document.getElementById("user_list_container");
          id?.classList?.value?.includes("hidden")
            ? id?.classList?.remove("hidden")
            : id?.classList?.add("hidden");
        }}
        className="flex items-center space-x-4 rtl:space-x-reverse"
      >
        <a
          href="#"
          id="menu"
          className="flex flex-col md:hidden ml-2 z-20 items-center p-2 border-gray-400 border-dark text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M5 7h14M5 12h14M5 17h14"
            />
          </svg>
        </a>
        {user?.profilePicture?.length > 1 ? (
          <img
            class="w-9 h-9 rounded-full"
            src={user?.profilePicture}
            alt="photo"
          />
        ) : (
          <div className="w-9 h-9 p-1 text-xl font-bold rounded-full flex items-center justify-center bg-red-700 text-white text-center">
            {user?.email?.substring(0, 1)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className=" font-medium text-gray-900 truncate dark:text-white">
            {user?.email}
          </p>

          <div className=" mt-[2px] text-gray-500 truncate dark:text-gray-400">
            {onlineUsers?.includes(user?.email)
              ? <p className="text-emerald-500">Online</p>
              : "last seen recently"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
