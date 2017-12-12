import isDefined from './isDefined';

export default function readFromPath(object, path, fallback = false) {
  if (!object) return fallback;

  const parts = path.split('.');
  const key = parts.shift();

  if (isDefined(object[key])) {
    if (parts.length > 0) {
      return readFromPath(object[key], parts.join('.'), fallback);
    }
    return object[key];
  }
  return fallback;
};
