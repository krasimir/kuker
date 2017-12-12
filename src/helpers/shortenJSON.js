const STR_LIMIT = 40;

export default function shortenJSON(data) {
  const str = JSON.stringify(data);

  if (str.length <= STR_LIMIT) return str;
  return str.substr(0, STR_LIMIT) + '...';
};
