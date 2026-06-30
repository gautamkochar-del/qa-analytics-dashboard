import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PassFailChart({ chart }) {
  return (
    <Doughnut
      data={{
        labels: chart.labels, datasets: [
          {
            data: chart.data, backgroundColor: [
              "#4CAF50", "#F44336", ], }, ], }}
    />
  );
}
