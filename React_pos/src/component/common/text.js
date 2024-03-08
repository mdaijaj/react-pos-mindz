import React, { useEffect, useCallback, useState } from "react";
import { translateLanguage } from "../common/commonFunction";

const Text = ({ content }) => {
  const [text, setText] = useState("");
  const getText = useCallback(async () => {
    let x = await translateLanguage(content);
    setText(x);
  }, [content]);
  useEffect(() => {
    getText();
  }, [getText]);

  return <>{text}</>;
};
export default Text;
