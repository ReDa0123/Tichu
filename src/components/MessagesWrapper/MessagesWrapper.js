import { getDisplayed } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { difference, head, map, o, prop, reverse } from "ramda";
import { deleteMessage } from "../../redux/actions";
import "./MessagesWrapper.scss";

const MessagesWrapper = ({ children }) => {
  const [lastMessages, setLastMessages] = useState([]);
  const dispatch = useDispatch();
  const messages = useSelector(getDisplayed);

  useEffect(() => {
    const newMessage = head(difference(messages, lastMessages));
    setLastMessages(messages);

    if (newMessage) {
      setTimeout(() => {
        dispatch(deleteMessage(prop("id", newMessage)));
      }, prop("time", newMessage));
    }
  }, [dispatch, lastMessages, messages]);

  return (
    <>
      <div className="MessagesWrapper">
        {o(
          map((message) => (
            <p key={message.id} style={{ color: message.color }}>
              {message.message}
            </p>
          )),
          reverse
        )(messages)}
      </div>
      {children}
    </>
  );
};

export default MessagesWrapper;
