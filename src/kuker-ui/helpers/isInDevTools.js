export default function isInDevTools() {
  if (!chrome || !chrome.runtime || !chrome.runtime.onMessage) return false;
  return true;
};
