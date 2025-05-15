import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useState, useEffect } from "react";

function TempChart({ tempData, tempUnit, isToday }) {
  // console.log("tempData from App, in tempChart");
  // console.log(tempData);

  // Responsive x axis interval for display
  const [xTickInterval, setXTickInterval] = useState(1); // Default interval

  useEffect(() => {
    const updateTickInterval = () => {
      if (window.innerWidth < 820) {
        setXTickInterval(2); 
      } else {
        setXTickInterval(1); 
      }
    };

    updateTickInterval(); 
    window.addEventListener("resize", updateTickInterval); 

    return () => window.removeEventListener("resize", updateTickInterval);
  }, []);

  if (!tempData.time.length) return;
  let unit = tempUnit === "metric" ? "°C" : "°F";
  const chartData = tempData.time.map((time, index) => ({
    hour: new Date(time).getHours() + "",
    temperature: tempData.temp[index],
  }));

  let temp_min = Math.min(...tempData.temp);
  // console.log(temp_min);
  let temp_max = Math.max(...tempData.temp);
  // console.log(temp_max);

  const currentHour = new Date().getHours() + "";

  

  return (
    <ResponsiveContainer width="100%">
      <LineChart
        data={chartData}
        margin={{ top: 0, right: 0, left: -28, bottom: -10 }}
      >
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 10, fill: "#333" }}
          interval={xTickInterval}
          tickSize={3}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#333" }}
          tickFormatter={(tick) => `${tick.toFixed()}°C`}
          tickSize={3}
          domain={[temp_min - 5, Math.max(temp_min + 10, temp_max + 5)]}
        />
        <Tooltip
          position={{ y: -30 }}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.3) " /* #3bbeee */,
            border: "1px solid",
            borderRadius: "10px",
          }}
          labelFormatter={() => ""}
          labelStyle={{ fontSize: "10px", color: "blue" }}
          itemStyle={{ fontSize: "11px", color: "#333", fontWeight: "bold" }}
          cursor={{ stroke: "#333", strokeWidth: 1 }}
          allowEscapeViewBox={{ x: false, y: true }}
          formatter={(value) => [`${value}${unit}`, `Temp`]}
        />
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#000"
          strokeOpacity="10%"
        />
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#333"
          strokeWidth={0.5}
          dot={{ r: 1, fill: "#333" }}
        />
        <ReferenceLine
          opacity={isToday}
          x={currentHour}
          stroke="blue"
          strokeDasharray="3 3"
          tick={{ fontSize: 10, fill: "#333" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
export default TempChart;
