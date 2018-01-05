export default function formatMilliseconds(millisec) {
  var seconds = (millisec / 1000).toFixed(0);
  var minutes = Math.floor(seconds / 60);
  var hours = '';
  var ms = Math.floor(millisec % 1000);
  if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      hours = (hours >= 10) ? hours : "0" + hours;
      minutes = minutes - (hours * 60);
      minutes = (minutes >= 10) ? minutes : "0" + minutes;
  }
  if (ms < 100) {
    if (ms < 10) { ms = '00' + ms; }
    else { ms = '0' + ms };
  }

  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  if (hours !== "") {
      return hours + ":" + minutes + ":" + seconds + ':' + ms;
  }
  return minutes + ":" + seconds + ':' + ms;
}