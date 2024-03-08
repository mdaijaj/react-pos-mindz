import "./App.scss";
import React, { useEffect, useState, useCallback } from "react";
import Login from "./component/login/";
import DefaultPage from "../src/component/defaultPage";

const App = () => {
  let [state, setState] = useState(false);
  const refresh = useCallback(() => setState(!state), [state]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    token && setState(true);
  }, []);

  const loginfailed = () => {
    if (sessionStorage.getItem("loginfailed")) {
      let loginfailed = sessionStorage.getItem("loginfailed");
      sessionStorage.setItem("loginfailed", JSON.parse(loginfailed) + 1);
    } else {
      sessionStorage.setItem("loginfailed", 1);
    }
  };

  return (
    <>
      {state ? (
        <DefaultPage refresh={refresh} />
      ) : (
        <Login refresh={refresh} loginfailed={loginfailed} />
      )}
    </>
  );
};
export default App;
