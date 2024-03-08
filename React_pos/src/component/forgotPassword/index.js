import "./index.scss";
import "../login/login.scss";
import React, { useState, useEffect } from "react";
import validate from "../common/validate";
import Timer from "./timer";
import axios from "axios";
const ForgotPassword = (props) => {
  const obj = {
    emailId: "",
    password: "",
    confirmpassword: "",
    AllowLogWithPasswordInResendOTPAttempts: "",
    OTP: "",
    otpverify: "",
    OTPButtonEnableTimeInSec: "",
    OTPGenerateTime: "",
    OTPValidityInMin: "",
    message: "",
    otpmessage: "",
  };
  const [newObj, setNewobj] = useState(obj);
  const [otpsec, setOtpsec] = useState(false);
  const [resendbtn, setResendbtn] = useState(false);
  const [disverify, setDisverify] = useState(false);
  const [resendCount, setResendCount] = useState(1);
  const [errorObj, setErrorObj] = useState(obj);
  const [disSubmit, setDisSubmit] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const handleChange = (e) => {
    if (e.target.value === "") {
      setNewobj({ ...newObj, [e.target.name]: e.target.value });
      setErrorObj({ ...errorObj, [e.target.name]: "" });
    } else {
      let validateType = e.target.getAttribute("data-valid");
      if (validateType) {
        let checkValidate = validate(e.target.value, validateType);
        if (checkValidate) {
          setNewobj({ ...newObj, [e.target.name]: e.target.value });
          setErrorObj({ ...errorObj, [e.target.name]: false });
        } else {
          setNewobj({ ...newObj, [e.target.name]: e.target.value });
          setErrorObj({ ...errorObj, [e.target.name]: true });
        }
      } else {
        setNewobj({ ...newObj, [e.target.name]: e.target.value });
        setErrorObj({ ...errorObj, [e.target.name]: false });
      }
    }
  };
  const confirmPass = (e) => {
    if (newObj.password === "") {
      setErrorObj({ ...errorObj, password: true });
    } else if (newObj.password !== newObj.confirmpassword) {
      setErrorObj({ ...errorObj, [e.target.name]: true });
    } else {
      setErrorObj({ ...errorObj, [e.target.name]: false });
    }
  };
  const submit = () => {
    if (
      newObj.emailId === "" ||
      newObj.password === "" ||
      newObj.confirmpassword === ""
    ) {
      if (newObj.emailId === "") {
        setErrorObj({ ...errorObj, emailId: true });
      } else if (newObj.password === "") {
        setErrorObj({ ...errorObj, password: true });
      } else if (newObj.confirmpassword === "") {
        setErrorObj({ ...errorObj, confirmpassword: true });
      }
    } else if (newObj.password !== newObj.confirmpassword) {
      alert("Password and confirm password did not match");
    } else {
      props.lodingProc(true);
      const saveObj = {
        EmailId: newObj.emailId,
        Password: newObj.confirmpassword,
        OTPPassword: "",
      };
      axios
        .post("/api/User/ForgetPassword", saveObj)
        .then((res) => {
          if (res.data.statuscode === 200) {
            setNewobj({
              ...newObj,
              AllowLogWithPasswordInResendOTPAttempts:
                res.data.Result.AllowLogWithPasswordInResendOTPAttempts,
              message: res.data.message,
              OTP: res.data.Result.OTP,
              OTPButtonEnableTimeInSec:
                res.data.Result.OTPButtonEnableTimeInSec,
              OTPGenerateTime: res.data.Result.OTPGenerateTime,
              OTPValidityInMin: res.data.Result.OTPValidityInMin,
              minTosec: parseInt(res.data.Result.OTPValidityInMin * 60),
            });
            setOtpsec(true);
            setDisSubmit(true);
            props.lodingProc(false);
          } else if (res.data.statuscode === 400) {
            setNewobj({
              ...newObj,
              message: res.data.message,
            });
            setDisSubmit(false);
            props.lodingProc(false);
          } else {
            alert("something went wrong");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const resendOtp = () => {
    setResendCount(resendCount + 1);
    if (resendCount < 3) {
      setResendbtn(false);
      setDisverify(false);
      submit();
    }
  };
  const submitverifyOtp = () => {
    const OtpObj = {
      EmailId: newObj.emailId,
      Password: newObj.confirmpassword,
      OTPPassword: newObj.otpverify,
    };
    axios
      .post("/api/User/ForgetPassword", OtpObj)
      .then((res) => {
        if (res.data.statuscode === 200) {
          setNewobj({ ...newObj, otpmessage: res.data.message });
          setOtpSuccess(true);
          props.lodingProc(false);
        } else {
          alert(
            "something went wrong please refresh your page and try again after some time"
          );
        }
      })
      .catch((err) => console.log(err));
  };
  const verifyOtp = () => {
    setDisverify(false);
    if (newObj.otpverify === "") {
      alert("please enter OTP");
    } else {
      if (newObj.OTP === newObj.otpverify) {
        submitverifyOtp();
        props.lodingProc(true);
      } else {
        alert("wrong OTP Value");
      }
    }
  };
  const resendBtnsts = () => {
    if (resendCount < 3) {
      setDisverify(true);
      setResendbtn(true);
    } else {
      setDisverify(true);
    }
  };

  return (
    <>
      {otpsec === false ? (
        <div className="loginBox forgotPassDiv">
          <div className="loginTitle">Forgot Password</div>
          <div className="message_f error">{newObj.message}</div>
          <div className="loginFormBox">
            <div
              className={
                errorObj.emailId === true ? "loginForm error" : "loginForm"
              }
            >
              <input
                data-valid="email"
                name="emailId"
                type="email"
                onChange={(e) => handleChange(e)}
                placeholder="Enter Email Id"
              />
            </div>
            <div
              className={
                errorObj.password === true ? "loginForm error" : "loginForm"
              }
            >
              <input
                type="password"
                name="password"
                onChange={(e) => handleChange(e)}
                autoComplete="new-password"
                placeholder="New Password"
              />
            </div>
            <div
              className={
                errorObj.confirmpassword === true
                  ? "loginForm error"
                  : "loginForm"
              }
            >
              <input
                type="password"
                onChange={(e) => handleChange(e)}
                onKeyUp={(e) => confirmPass(e)}
                name="confirmpassword"
                placeholder="Confirm New Password"
              />
            </div>
            <div
              className={
                disSubmit === false ? "loginForm" : "loginForm disable"
              }
            >
              <button
                onClick={() =>
                  disSubmit === false
                    ? submit()
                    : () => {
                        return false;
                      }
                }
              >
                Submit
              </button>
            </div>
            <div className="forgotpass">
              <button
                onClick={() => props.forgotstatus(false)}
                className="forgotpassLink"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="loginBox forgotPassDiv">
          <div className="loginTitle">Verify Otp </div>
          {otpSuccess === false ? (
            <div className="loginFormBox">
              <div className="message_f success">{newObj.message}</div>
              <div
                className={
                  errorObj.otp === true ? "loginForm error" : "loginForm"
                }
              >
                <input
                  type="text"
                  onChange={(e) => handleChange(e)}
                  name="otpverify"
                  placeholder="Enter OTP"
                />
              </div>
              <div className="loginForm">
                {disverify === false ? (
                  <button onClick={() => verifyOtp()}>Verify</button>
                ) : resendCount > 2 && disverify === true ? (
                  <span style={{ color: "#f00" }}>
                    You can't resend OTP again please Try again after some time.
                  </span>
                ) : (
                  <span style={{ color: "#f00" }}>
                    OTP has been expired please resend OTP
                  </span>
                )}
              </div>
              <div className="forgotpass">
                <button
                  className={
                    resendCount === 3 || resendbtn === false
                      ? "forgotpassLink disable"
                      : "forgotpassLink"
                  }
                  onClick={
                    resendCount === 3 || resendbtn === false
                      ? () => {
                          return false;
                        }
                      : () => resendOtp()
                  }
                >
                  Resend OTP
                </button>
              </div>
              <div className="validtime">
                OTP Valid For
                {resendbtn === false ? (
                  <Timer
                    resbtn={() => resendBtnsts()}
                    count={resendCount}
                    minute={parseInt(newObj.OTPValidityInMin) * 60}
                  />
                ) : (
                  <span>0:0</span>
                )}
              </div>
            </div>
          ) : (
            <div className="loginFormBox">
              <div className="message_f success">{newObj.otpmessage}</div>
              <div className="loginForm">
                <button onClick={() => window.location.reload()}>
                  Contniue Login
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default ForgotPassword;
