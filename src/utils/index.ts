export const formatTime = (s: number) => {
    let seconds = Math.floor(s / 1000) % 60,
        minutes = Math.floor(s / (1000 * 60)) % 60,
        hours = Math.floor(s / (1000 * 60 * 60)) % 24;

    const _hours = (hours < 10) ? `0${hours}` : hours;
    const _minutes = (minutes < 10) ? `0${minutes}` : minutes;
    const _seconds = (seconds < 10) ? `0${seconds}` : seconds;

    if (s < 3600000) {
      return `${_minutes}:${_seconds}`;
    } else {
      return `${_hours}:${_minutes}:${_seconds}`;
    }
}