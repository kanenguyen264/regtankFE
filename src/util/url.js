function validURL(str) {
  if (!str) {
    return false;
  }
  const res = str.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g
  );
  return res !== null;
}

function getUrlParts(url) {
  if (validURL(url)) {
    try {
      return new URL(url);
    } catch (error) {
      return null;
    }
  }
  return null;
}

function getHostURL(url) {
  const hostUrl = getUrlParts(url);
  if (hostUrl) {
    return hostUrl.hostname;
  }
  return "";
}

export { getUrlParts, validURL, getHostURL };
