export default function getMachineName({ name }) {
  if (name.indexOf('_@@@') === 0) {
    return '<unnamed>';
  }
  return name;
};
