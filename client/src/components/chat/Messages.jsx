import React from "react";
import Loading from "../loading/Loading";
import { format } from "timeago.js";
import "./typing.css";

const Messages = ({
  isLoading,
  isError,
  receiver,
  sender,
  texts,
  currentUser,
  refer,
  typing,
}) => {
  return (
    <div
      id="messages"
      className="flex w-full flex-col h-[72vh] bg-white bg-dark pb-5 p-3 overflow-y-auto scrollbar-thumb-red scrollbar-thumb-rounded scrollbar-track-red-lighter scrollbar-w-2 scrolling-touch"
    >
      {isLoading && <Loading text="text-gray-500" />}
      {isError && <p>something went wrong unable to read the messages</p>}
      {receiver && sender ? (
        texts && texts?.length > 0 ? (
          texts?.map((message) => {
            if (message?.message?.content?.length > 0)
              return (
                <div key={message?._id} className="chat-message mt-2">
                  <div
                    className={`flex ${
                      message?.sender?._id !== currentUser?._id
                        ? "items-start"
                        : "items-end justify-end"
                    }`}
                  >
                    <div
                      className={`flex flex-col space-y-2  max-w-xs mx-2 mt-2 order-2 ${
                        message?.sender?._id !== currentUser?._id
                          ? "items-start"
                          : "items-end"
                      }`}
                    >
                      <div className="">
                        <div
                          className={`px-4 py-2 rounded-lg inline-block rounded-bl-none  ${
                            message?.sender?._id !== currentUser?._id
                              ? "bg-gray-300 text-gray-700"
                              : "bg-red-700 text-white"
                          } `}
                        >
                          {message?.messageType === "text" && (
                            <p className="">{message?.message?.content}</p>
                          )}
                          {message?.messageType === "file" &&
                          message?.message?.content?.length > 0
                            ? message?.message?.content?.map((el) => {
                                if (el.mimetype.split("/")[0] === "audio") {
                                  return (
                                    <div className="w-full flex gap-3 items-center justify-center flex-col text-white rounded-md ">
                                      <div className="flex justify-between items-center py-2 px-2 w-[100%]">
                                        <p className="font-semibold text-sm w-auto uppercase">
                                          {el.mimetype.split("/")[0]}
                                        </p>
                                        <a
                                          href={el?.path}
                                          download
                                          // onClick={() =>
                                          //   handleDownload(`${el.path}`)
                                          // }
                                          className="rounded-lg py-1 cursor-pointer hover:bg-gray-300 px-2 bg-gray-100 text-main"
                                        >
                                          <svg
                                            class="w-6 h-6"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke="currentColor"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                                            />
                                          </svg>
                                        </a>
                                      </div>
                                      <audio
                                        controls
                                        src={`${el.path}`}
                                        className="w-[98%] h-32 object-cover mt-[2px] mx-[2px]"
                                      ></audio>
                                      <div className="flex flex-col gap-1 items-center max justify-between mx-1">
                                        <p className=" font-bold w-auto ">
                                          File Type :{" "}
                                          <span className="font-normal">
                                            {el.mimetype}
                                          </span>
                                        </p>
                                        <p className=" font-bold w-auto px-10 ">
                                          Name :{" "}
                                          <span className="font-normal">
                                            {el.originalname}
                                          </span>
                                        </p>
                                        <p className=" font-bold w-auto">
                                          Size:{" "}
                                          <span className="font-normal">
                                            {el.size} MB
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  );
                                } else if (
                                  el.mimetype.split("/")[0] === "video"
                                ) {
                                  return (
                                    <div className="w-[100%]  items-center flex flex-col text-white rounded-md ">
                                      <div className="flex justify-between items-center py-2 px-2 w-[100%]">
                                        <p className="font-semibold text-sm w-auto uppercase">
                                          {el.mimetype.split("/")[0]}
                                        </p>
                                        <a
                                          href={el?.path}
                                          download
                                          // onClick={() =>
                                          //   handleDownload(`${el.path}`)
                                          // }
                                          className="rounded-lg py-1 cursor-pointer hover:bg-gray-300 px-2 bg-gray-100 text-main"
                                        >
                                          <svg
                                            class="w-6 h-6"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke="currentColor"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                                            />
                                          </svg>
                                        </a>
                                      </div>
                                      <video
                                        controls
                                        src={`${el.path}`}
                                        className="w-[98%] h-40 object-cover mt-[2px] mx-[2px]"
                                      ></video>
                                      <div className="flex flex-col gap-1 items-start py-2 max justify-between mx-1">
                                        <p className=" font-bold w-auto ">
                                          File Type :{" "}
                                          <span className="font-normal">
                                            {el.mimetype}
                                          </span>
                                        </p>
                                        <p className=" font-bold w-auto ">
                                          Name :{" "}
                                          <span className="font-normal">
                                            {el.originalname}
                                          </span>
                                        </p>
                                        <p className=" font-bold w-auto">
                                          Size:{" "}
                                          <span className="font-normal">
                                            {el.size} MB
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  );
                                } else if (
                                  el.mimetype.split("/")[0] === "image"
                                ) {
                                  return (
                                    <div className="w-[100%]  items-center flex flex-col text-white rounded-md  ">
                                      <div className="flex justify-between items-center py-2 px-2 w-[100%]">
                                        <p className="font-semibold text-sm w-auto uppercase">
                                          {el.mimetype.split("/")[0]}
                                        </p>
                                        <a
                                          href={el?.path}
                                          download
                                          // onClick={() =>
                                          //   handleDownload(`${el.path}`)
                                          // }
                                          className="rounded-lg py-1 cursor-pointer hover:bg-gray-300 px-2 bg-gray-100 text-main"
                                        >
                                          <svg
                                            class="w-6 h-6"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke="currentColor"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                                            />
                                          </svg>
                                        </a>
                                      </div>
                                      <img
                                        src={`${el.path}`}
                                        alt="user"
                                        className="w-[98%] h-[100%] object-cover mt-[2px] mx-[2px]"
                                      />
                                      <div className="flex flex-col gap-1 items-center max justify-between mx-1">
                                        <p className=" font-bold w-auto ">
                                          File Type :{" "}
                                          <span className="font-normal">
                                            {el.mimetype}
                                          </span>
                                        </p>
                                        <p className=" font-bold w-auto px-10 ">
                                          Name :{" "}
                                          <span className="font-normal">
                                            {el.originalname}
                                          </span>
                                        </p>
                                        <p className=" font-bold w-auto">
                                          Size:{" "}
                                          <span className="font-normal">
                                            {el.size} MB
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  );
                                } else if (
                                  el.mimetype.split("/")[0] !== "image" &&
                                  el.mimetype.split("/")[0] !== "audio" &&
                                  el.mimetype.split("/")[0] !== "video"
                                ) {
                                  return (
                                    <div className="w-[100%]  items-center flex flex-col text-white rounded-md  ">
                                      <div className="flex justify-between items-center py-2 px-2 w-[100%]">
                                        <p className="font-semibold text-sm w-auto uppercase">
                                          {el.mimetype.split("/")[1]}
                                        </p>
                                        <a
                                          href={el?.path}
                                          download
                                          // onClick={() =>
                                          //   handleDownload(`${el.path}`)
                                          // }
                                          className="rounded-lg py-1 cursor-pointer hover:bg-gray-300 px-2 bg-gray-100 text-main"
                                        >
                                          <svg
                                            class="w-6 h-6"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              stroke="currentColor"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"
                                            />
                                          </svg>
                                        </a>
                                      </div>

                                      <svg
                                        class="w-20 h-20"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill-rule="evenodd"
                                          d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2-2a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm0 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm-6 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6Zm8 1v1h-2v-1h2Zm0 3h-2v1h2v-1Zm-4-3v1H9v-1h2Zm0 3H9v1h2v-1Z"
                                          clip-rule="evenodd"
                                        />
                                      </svg>

                                      <div className="flex flex-col gap-1 items-center max justify-between mx-1">
                                        <p className=" font-bold w-auto ">
                                          File Type :{" "}
                                          <span className="font-normal">
                                            {el.mimetype}
                                          </span>
                                        </p>
                                        <p className=" font-bold w-auto px-10 ">
                                          Name :{" "}
                                          <span className="font-normal">
                                            {el.originalname}
                                          </span>
                                        </p>
                                        <p className=" font-bold w-auto">
                                          Size:{" "}
                                          <span className="font-normal">
                                            {el.size}
                                          </span>
                                        </p>

                                        {/* {message?.message?.description && (
                                        <p className=" w-auto mt-2 mb-5">
                                          description:{" "}
                                          <span className="">
                                            {message?.message?.description}
                                          </span>
                                        </p>
                                      )} */}
                                      </div>
                                    </div>
                                  );
                                }
                              })
                            : null}
                        </div>
                        {message?.message?.description && (
                          <p className=" w-auto mt-2 mb-5">
                            description:{" "}
                            <span className="">
                              {message?.message?.description}
                            </span>
                          </p>
                        )}
                        <p className="text-gray-500 flex items-center mt-2 gap-1">
                          <svg
                            class="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          {format(message?.createdAt)}
                        </p>
                      </div>
                    </div>
                    {message?.sender?.profilePicture?.length > 1 ? (
                      <img
                        class="w-9 h-9 rounded-full"
                        src={message?.sender?.profilePicture}
                        alt="photo"
                      />
                    ) : (
                      <div className="w-9 h-9 p-1 text-xl font-bold rounded-full flex items-center justify-center bg-red-700 text-white text-center">
                        {message?.sender?.email?.substring(0, 1)}
                      </div>
                    )}
                  </div>
                </div>
              );
          })
        ) : (
          <div className="flex flex-col items-center w-full h-full justify-center space-y-4 p-3 overflow-y-auto scrollbar-thumb-red scrollbar-thumb-rounded scrollbar-track-red-lighter scrollbar-w-2 scrolling-touch">
            say hi, to your friend.
          </div>
        )
      ) : (
        <div className="flex flex-col items-center w-full h-full justify-center space-y-4 p-3 overflow-y-auto scrollbar-thumb-red scrollbar-thumb-rounded scrollbar-track-red-lighter scrollbar-w-2 scrolling-touch">
          select a chat to start messaging.
        </div>
      )}

      {typing && (
        <div className=" text-main absolute bottom-16 flex gap-2 items-center justify-center ml-4 mt-1">
          <div class="chat-bubble">
            <div class="typing">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
      )}

      <div ref={refer} />
    </div>
  );
};

export default Messages;
