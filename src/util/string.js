import { get, unescape, truncate } from "lodash";

function avatarString(firstName, lastName) {
  const F = firstName || "";
  const L = lastName || "";
  const avatarName = F.substr(0, 1) + L.substr(0, 1);
  return avatarName;
}

/**
 * Pseudo-random string generator
 * http://stackoverflow.com/a/27872144/383904
 * Default: return a random alpha-numeric string
 *
 * @param {Integer} len Desired length
 * @param {String} an Optional (alphanumeric), "a" (alpha), "n" (numeric)
 * @return {String}
 */
function randomString(len, an) {
  an = an && an.toLowerCase();
  var str = "",
    i = 0,
    min = an === "a" ? 10 : 0,
    max = an === "n" ? 10 : 62;
  for (; i++ < len; ) {
    var r = (Math.random() * (max - min) + min) << 0;
    str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
  }
  return str;
}

const covertToNormalWord = (str) => {
  // filter uppercase
  str = str.toLowerCase();
  // filter lower case
  str = str
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d")
    .replace(/́/g, "")
    .trim();
  return str;
};

const getFirstString = (string) => {
  if (string) {
    return string.substr(0, 1);
  }
  return "";
};

const getFullName = (user) => {
  if (!user) {
    return "";
  }
  const firstName = get(user, "firstName") || "";
  const lastName = get(user, "lastName") || "";
  const middleName = get(user, "middleName") || "";
  return [firstName, middleName, lastName].join(" ");
};

const replaceHtmlEntites = (string) => {
  if (!string) {
    return "";
  }

  let cleanText = string.replace(/\xA0/g, " ");
  cleanText = unescape(cleanText);
  return cleanText;
};

const truncateStr = (str, n = 250, useWordBoundary = "&hellip;") => {
  const options = {
    length: n,
    separator: useWordBoundary,
  };
  return truncate(str, options);
};

const capitalizeFirstLetter = (string = "") => {
  if (string && string.length) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return null;
};

/**
 * Display limit text by lenght number.
 *
 * @param {string} text: base text
 * @param {number} limit: number character of text will display, default value: 10
 * @param {string} ellipsis: the last text will display, default value : '...'
 * @returns textResult
 */
const displayLimitText = (text, limit = 10, ellipsis = "...") => {
  let textResult = text;
  if (typeof text === "string" && text.length > limit) {
    textResult = text.slice(0, limit) + ellipsis;
  }
  return textResult;
};

const convertValueToCharacter = (value) => {
  if (value > 999) {
    return "999+";
  }

  return value;
};

export {
  avatarString,
  randomString,
  covertToNormalWord,
  getFirstString,
  getFullName,
  replaceHtmlEntites,
  truncateStr,
  displayLimitText,
  capitalizeFirstLetter,
  convertValueToCharacter,
};
