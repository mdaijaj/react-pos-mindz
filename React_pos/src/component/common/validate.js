const validate = (val, type) => {
  switch (type) {
    case "number":
      let num = /^[0-9+]+$/.test(val);
      return num;
    case "monumber":
      let monum = /^[0-9+]+$/.test(val);
      return monum;
    case "character":
      let char = /^[a-z-A-Z]+$/.test(val);
      return char;
    case "special":
      let chars = /^[a-z-A-Z-\s]+$/.test(val);
      return chars;
    case "varChar":
      let varChar = /^[a-z-A-Z-0-9-_]+$/.test(val);
      return varChar;
    case "varCharSpace":
      let varCharSpace = /^[a-z-A-Z-0-9-_ ]+$/.test(val);
      return varCharSpace;
    case "email":
      let email = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(
        val
      );
      return email;
    default:
      return false;
  }
};
export default validate;
