export default function formatPropValue(value, maxLen = 20) {
  try {
    const str = JSON.stringify(value);

    if (str.length > maxLen) {
      return str.substr(0, maxLen) + '...';
    }
    return str;
  } catch (error) {
    return '';
  }
};
