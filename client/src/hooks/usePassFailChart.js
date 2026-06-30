import { useEffect, useState } from "react";
import { getPassFailChart } from "../api/dashboardChartApi";

export default function usePassFailChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getPassFailChart();
        setData(result);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading };
}
