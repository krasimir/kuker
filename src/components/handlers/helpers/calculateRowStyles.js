export default function calculateRowStyles({ color }, defaults = {}) {
  return {
    backgroundColor: color ? color : (defaults.color ? defaults.color : '#e6e6e6')
  };
}
