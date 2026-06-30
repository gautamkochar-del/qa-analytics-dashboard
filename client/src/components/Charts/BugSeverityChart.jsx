import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, } from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Tooltip, Legend
);

export default function BugSeverityChart({ chart }) {
  return (
    <Bar
      data={{
        labels: chart.labels, datasets: [
          {
            label: "Bugs", data: chart.data, }, ], }}
    />
  );
}
