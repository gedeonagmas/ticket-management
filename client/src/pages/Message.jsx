import { DarkThemeToggle } from "flowbite-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  useCreateMutation,
  useLazyReadChatQuery,
  useLazyReadQuery,
} from "../features/api/apiSlice";
import Response from "../components/Response";
import Messages from "../components/chat/Messages";
import MessageInput from "../components/chat/MessageInput";
import ChatHeader from "../components/chat/ChatHeader";
import UserList from "../components/chat/UserList";

const Message = () => {
  const [socket, setSocket] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("ticket_user"));

  const [sendMessageData, sendMessageResponse] = useCreateMutation();
  const [sender, setSenderId] = useState("");
  const [receiver, setReceiverId] = useState("");

  const [onlineUsers, setOnlineUsers] = useState();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [texts, setTexts] = useState();
  const [typing, setTyping] = useState(false);
  const [chatId, setChatId] = useState("");
  const [files, setFiles] = useState("");
  const [messageType, setMessageType] = useState("text");
  const [description, setDescription] = useState("");
  const refer = useRef(null);
  const [receiverUser, setReceiverUser] = useState("");

  const [trigger, { data: messageData, isLoading, isError }] =
    useLazyReadChatQuery({ refetchOnFocus: false });

  useEffect(() => {
    if (receiver && sender) {
      trigger({
        url: `/chat/${sender}.${receiver}?populate=sender,receiver`,
        tag: ["chats"],
      });
    }
  }, [receiver, sender]);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(30);

  const [
    userDataTrigger,
    { data: userDatas, isFetching: userIsFetching, isError: userIsError },
  ] = useLazyReadQuery();

  useEffect(() => {
    userDataTrigger({
      url: `/user/users?limits=${limit}&searchField=email&searchValue=${search}`,
      tag: ["users"],
    });
  }, [limit, search]);

  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const aa = [];
    userDatas?.data?.map((e) => {
      onlineUsers?.includes(e?.email) ? aa.unshift(e) : aa.push(e);
    });
    setUserData(aa);
  }, [userDatas]);

  useEffect(() => {
    setReceiverUser(currentUser);
  }, []);

  useEffect(() => {
    setSocket(io("https://tasks.skylightethiopia.com"));
  }, []);

  useEffect(() => {
    socket?.emit("connect-user", currentUser?.email);
    socket?.on("aaa", (val) => {
      setOnlineUsers(val);
    });
  }, [socket]);

  const sendHandler = () => {
    if (sender && receiver) {
      const formData = new FormData();
      formData.append("sender", sender);
      formData.append("receiver", receiver);
      formData.append("message", message);
      formData.append("messageType", messageType);
      formData.append("description", description);
      formData.append("url", "/chat");
      formData.append("tag", ["chats"]);
      files?.length > 0
        ? [...files].forEach((file) => {
            formData.append("chatFile", file);
          })
        : formData.append("chatFile", files);
      sendMessageData(formData);
    }
  };

  useEffect(() => {
    if (messageData !== undefined) {
      setChatId(messageData?.data[0]?.chatId);
      setTexts(messageData?.data);
      socket?.emit("aa", messageData?.data, messageData?.data[0]?.chatId);
      socket?.on("bb", (text) => {
        setTexts(text);
      });
    }
  }, [messageData]);

  useEffect(() => {
    refer.current?.scrollIntoView();
  }, [texts]);

  useEffect(() => {
    refer.current?.scrollIntoView();
  }, [typing]);

  const popup = (id) => {
    const i = document.getElementById(id);
    i?.classList?.value?.includes("hidden")
      ? (i.classList?.remove("hidden"), i.classList?.add("flex"))
      : (i.classList?.remove("flex"), i.classList?.add("hidden"));
  };

  // typing handler
  const typingHandler = (e) => {
    if (e.target.value.length > 0) {
      socket?.emit("typing t", true, chatId);
      socket?.on("typing true", (bool) => {
        setTyping(bool);
      });
    } else {
      socket?.emit("typing f", false, chatId);
      socket?.on("typing false", (bool) => {
        setTyping(bool);
      });
    }
  };

  useEffect(() => {
    if (message.length > 0) {
      socket?.emit("typing t", true, chatId);
      socket?.on("typing true", (bool) => {
        setTyping(bool);
      });
    } else {
      socket?.emit("typing f", false, chatId);
      socket?.on("typing false", (bool) => {
        setTyping(bool);
      });
    }
  }, [message]);

  useEffect(() => {
    if (sendMessageResponse?.status === "fulfilled" && messageType === "file") {
      setMessageType("file");
      setFiles("");
      popup("file-send");
      setDescription("");
      setMessage("");
    }
  }, [sendMessageResponse]);

  useEffect(() => {
    if (sendMessageResponse?.status === "fulfilled") {
      setMessage("");
    }
  }, [sendMessageResponse]);

  return (
    <div className="flex -mt-6 mr-1 text-xs bg-white bg-dark overflow-hidden relative">
      <Response response={sendMessageResponse} setPending={setPending} />

      <div className="w-full bg-white bg-dark overflow-hidden flex h-[88vh]">
        <div
          id="user_list_container"
          className="absolute hidden md:block bg-white bg-dark z-20 left-0 top-0 md:top-0  md:relative w-[80%] md:w-[25%]"
        >
          <UserList
            userIsFetching={userIsFetching}
            userIsError={userIsError}
            userData={userData}
            currentUser={currentUser}
            setReceiverId={setReceiverId}
            setSenderId={setSenderId}
            onlineUsers={onlineUsers}
            setSearch={setSearch}
            receiver={receiver}
            setReceiverUser={setReceiverUser}
            limit={limit}
            setLimit={setLimit}
          />
        </div>

        <div className="flex relative w-full md:w-[76%] bg-white overflow-hidden h-[87vh] flex-col border-r">
          <ChatHeader
            onlineUsers={onlineUsers}
            user={receiverUser ? receiverUser : currentUser}
          />
          <Messages
            isLoading={isLoading}
            isError={isError}
            receiver={receiver}
            sender={sender}
            texts={texts}
            currentUser={currentUser}
            typing={typing}
            refer={refer}
          />

          <MessageInput
            popup={popup}
            typingHandler={typingHandler}
            setMessage={setMessage}
            pending={pending}
            sendHandler={sendHandler}
            setFiles={setFiles}
            files={files}
            setDescription={setDescription}
            setMessageType={setMessageType}
            message={message}
            receiver={receiver}
            sender={sender}
          />
        </div>
      </div>
    </div>
  );
};

export default Message;
