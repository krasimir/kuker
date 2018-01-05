/* eslint-disable no-use-before-define */
const PREVIEW_STR_LIMIT = 40;

function previewObject(object) {
  const keys = Object.keys(object);

  if (keys.length === 0) return '{}';

  const objectInternals = keys.map(key => {
    if (typeof object[key] === 'object') {
      if (Array.isArray(object[key])) {
        return `${key}: ${ previewArray(object[key]) }`;
      }
      return `${ key }: { ... }`;
    } else if (typeof object[key] === 'string') {
      return `${ key }: "${ String(object[key]) }"`;
    }
    return `${ key }: ${ String(object[key]) }`;
  });

  return `{ ${ objectInternals.join(', ') } }`;
}
function previewArray(array) {
  if (array.length === 0) return '[]';
  return `[...${ array.length }]`;
}

export default function renderJSONPreview(data, limit = PREVIEW_STR_LIMIT) {
  let result;

  if (typeof data === 'object') {
    result = Array.isArray(data) ? previewArray(data) : previewObject(data);
  } else if (typeof data === 'string') {
    result = `"${ data }"`;
  } else if (typeof data === 'number') {
    result = data;
  } else {
    return null;
  }

  return result.length > limit ? result.substr(0, limit) + '...' : result;
};
