import { Tooltip } from "@mui/material";
import React from "react";
import { Cell, Legend, Pie, PieChart } from "recharts";

const COLORS = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
];

const PollResult = ({ data, labels }) => {
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index],
  }));

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        dataKey="Value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {chartData.map((_, index) => (
          <Cell
            key={`cell-${(index + Math.random()).toString().replace(".", "")}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Legend />
      <Tooltip />
    </PieChart>
  );
};

export default PollResult;
