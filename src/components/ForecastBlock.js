import React from "react";
import "./ForecastBlock.css";

function ForecastBlock({ date, temp_min, temp_max, icon, onClick}) {
  return (
    <div className="day-fc" onClick={onClick}>
      <h2 className="fc-date">{date}</h2>
      <img src={icon} className="fc-icon" alt="weather desc icon"></img>
      <div className="fc-temp">
        <h2 className="fc-temp-min">{temp_min}°</h2>
        <div className="fc-temp-divider"></div>
        <h2 className="fc-temp-max">{temp_max}°</h2>
      </div>
    </div>
  );
}

export default ForecastBlock;
