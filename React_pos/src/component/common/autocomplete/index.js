import "./index.scss";
import React, { useRef, useState, useEffect, useCallback } from "react";
const Autocomplete = ({ options, labelText }) => {
  const [positionEl, setPosition] = useState({});
  const [optionsList, setOptions] = useState(options);
  const [val, setVal] = useState({ value: "" });
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const onFocusAction = (e) => {
    const position = inputRef.current.getBoundingClientRect();
    // console.log({
    //   width: position.width,
    //   top: position.height,
    //   position: "absolute",
    // });
    setPosition({
      width: position.width,
      top: position.height,
      position: "absolute",
    });
    setOpen(true);
  };
  const setOptionLIst = useCallback((abc) => {
    setOptions(abc);
  }, []);
  useEffect(() => {
    setOptionLIst(options);
  }, [options, setOptionLIst]);
  const handleChange = (value) => {
    setVal({ value: value[labelText] });
    setOpen(false);
  };
  const inputOnChange = (e) => {
    setVal({ value: e.target.value });
    //  filterOption(e.target.value);
  };
  const filterOption = (input) => {
    const filteredOptions = options.filter(
      (option) =>
        option[labelText].toLowerCase().indexOf(input.toLowerCase()) > -1
    );
    setOptionLIst(filteredOptions);
  };
  const onBlurAction = () => {
    setTimeout(() => setOpen(false), 400);
  };
  useEffect(() => {
    //console.log(optionsList, "optionsList");
    // console.log(optionsList.length, "ddd");
  }, [positionEl, optionsList, val]);
  return (
    <>
      <div className="autocomplete">
        <input
          ref={inputRef}
          type="text"
          value={val.value}
          onChange={(e) => inputOnChange(e)}
          onFocus={(e) => onFocusAction(e)}
          onBlur={() => onBlurAction()}
        />
        {open && (
          <div className="optionList" style={positionEl}>
            <ul>
              {optionsList.map((option, index) => (
                <li key={index} onClick={() => handleChange(option)}>
                  {option[labelText]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
export default Autocomplete;
