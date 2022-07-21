import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { updateChat } from "../store/slice";
import { v4 as uuidv4 } from "uuid";
import {
  get as getLocalStorage,
  set as setLocalStorage,
} from "simple-webstorage/lib/local";

import {
  get as getSessionStorage,
  set as setSessionStorage,
} from "simple-webstorage/lib/session";
const Chat = () => {
  var user_id = getSessionStorage("id_key");
  const dispatch = useDispatch();
  const numberOfMessages = 15;
  const [isMessageSent, setIsMessageSent] = useState(false);
  const chat = useSelector((state) => state.chat.data);
  const [nextMessages, setNextMessages] = useState(numberOfMessages);
  const loadMoreMessages = () => {
    setNextMessages(nextMessages + numberOfMessages);
  };
  var username = "";
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    if (getLocalStorage("key") !== null) {
      dispatch(updateChat(getLocalStorage("key")));
    } else {
      setLocalStorage("key", {
        message: [{}],
      });
    }
    if (getSessionStorage("id_key") !== null) {
      console.log(getSessionStorage("id_key"));
      user_id = getSessionStorage("id_key");
    } else {
      setSessionStorage("id_key", uuidv4());
    }
  }, [isMessageSent]);

  setInterval(() => {
    dispatch(updateChat(getLocalStorage("key")));
  }, 1000);

  const inputChatOnChange = (e) => {
    e.preventDefault();
    setChatMessage(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const id = getSessionStorage("id_key");
    const name = getSessionStorage("name");

    if (chatMessage.length > 0 && name !== null) {
      const oldMsg = getLocalStorage("key");
      console.log(oldMsg.message);
      const newMsg = [
        ...oldMsg.message,
        {
          id: id,
          name: name,
          usermessage: chatMessage,
        },
      ];
      console.log(newMsg);
      console.log(name);
      console.log(id);
      setLocalStorage("key", { message: newMsg });
      setIsMessageSent(!isMessageSent);
    } else {
      promptUser();
    }
  };
  const promptUser = () => {
    let person = prompt("Please enter your name", "");
    if (person != null) {
      setSessionStorage("name", person);
      username = person;
      console.log(username);
    }
  };

  return (
    <div className="chat">
      {nextMessages < chat.message?.length && (
        <button onClick={loadMoreMessages}>Load More</button>
      )}

      <ul>
        {chat.message?.slice(-nextMessages)?.map((message, index) => {
          return (
            <li key={index}>
              {message.id === user_id ? (
                <div
                  className={`flex ${
                    message.id === user_id ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="chat-message">
                    <div className="flex items-end">
                      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <div>
                          <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                            {message.usermessage}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 flex flex-col items-center rounded-full order-1 bg-blue-100">
                        <span className="pt-2">{message.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex ${
                    message.id === user_id ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="chat-message">
                    <div className="flex items-end justify-end">
                      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div>
                          <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                            {message.usermessage}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 flex flex-col items-center rounded-full order-1 bg-blue-100">
                        <span className="pt-2">{message.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex mt-10">
        <input
          type="text"
          name="message"
          autocomplete="off"
          placeholder="Type a message ..."
          onChange={inputChatOnChange}
          className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
        />
        <button
          onClick={sendMessage}
          className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
