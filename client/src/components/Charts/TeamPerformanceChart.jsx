import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, } from "chart.js";

import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend
);

export default function TeamPerformanceChart({ chart }) {
  return (
    <Radar
      data={{
        labels: chart.labels, datasets: [
          {
            label: "Performance %", data: chart.data, }, ], }}
    />
  );
}
