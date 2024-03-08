//
const vText = (t, min, max) => {
  if (t && t.length > 0) {
    if (t.length < min || t.length > max) {
      return false;
    }
  }
  return true;
};
const vNum = (n, min, max) => {
  if (n >= 0) {
    if (n.length < min || n.length > max) {
      return false;
    }
  } else {
    return false;
  }
  return true;
};

const vEmail = (mail) => {
  if (
    /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(
      mail
    )
  ) {
    return true;
  }
  return false;
};

export { vText, vNum, vEmail };
