import { useEffect, useState } from "react";
import { getExecutionTrend } from "../api/dashboardChartApi";

export default function useExecutionTrend() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getExecutionTrend();
        setData(result);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading };
}
