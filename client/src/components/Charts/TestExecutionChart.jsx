import {
  Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, } from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend
);

export default function TestExecutionChart({ chart }) {
  const data = {
    labels: chart.labels, datasets: [
      {
        label: "Executed Tests", data: chart.data, borderColor: "#1976d2", tension: 0.4, }, ], };

  return <Line data={data} />;
}
