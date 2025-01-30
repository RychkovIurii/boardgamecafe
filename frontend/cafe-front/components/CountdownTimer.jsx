import React, { useState, useEffect } from 'react';

function CountdownTimer({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const isTimeUp = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div>
      {isTimeUp ? (
        <span>Time's up!</span>
      ) : (
        <>
          {timeLeft.days > 0 && <span>{timeLeft.days} days </span>}
          {(timeLeft.days > 0 || timeLeft.hours > 0) && <span>{timeLeft.hours} hours </span>}
          {(timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0) && <span>{timeLeft.minutes} minutes </span>}
          <span>{timeLeft.seconds} seconds</span>
        </>
      )}
    </div>
  );
}

export default CountdownTimer;
