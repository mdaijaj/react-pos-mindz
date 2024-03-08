import "./popUp.scss";
const MessagePopUp = (props) => {
  return (
    <>
      <div className="messagePopup">
        <div className="popup">
          <div className="popHead">
            Message
            <button
              onClick={() => props.closePopup()}
              className="closePop"
            ></button>
          </div>
          <div className="popBody">{props.message}</div>
        </div>
      </div>
    </>
  );
};
export default MessagePopUp;
