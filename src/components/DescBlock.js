import React from "react";
import "./DescBlock.css";

function DescBlock({ title, iconSrc, value, unit, wind_dir }) {
  if (wind_dir) {
    return (
      <div className="weather-desc" id="wind-desc">
        <div className="desc-head">
          <img
            src={iconSrc}
            className="desc-icon"
            alt="weather desc icon"
          ></img>
          <h2>{title}</h2>
        </div>
        <div className="desc-tail">
          <p className="value-wind">
            {value}
            <u className="desc-unit">{unit}</u>
          </p>
          <img
            src="/icons/icon_arrow.png"
            className="desc-wind-dir"
            alt="wind direction icon"
            style={{ transform: `rotate(${wind_dir}deg)` }}
          ></img>
        </div>
      </div>
    );
  }
  return (
    <div className="weather-desc">
      <div className="desc-head">
        <img src={iconSrc} className="desc-icon" alt="weather desc icon"></img>
        <h2>{title}</h2>
      </div>
      <div className="desc-tail">
        <p>
          {value}
          <u className="desc-unit">{unit}</u>
        </p>
      </div>
    </div>
  );
}

export default DescBlock;
