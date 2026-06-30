import { useEffect, useState } from "react";
import { getBugSeverity } from "../api/dashboardChartApi";

export default function useBugSeverity() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getBugSeverity();
        setData(result);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading };
}
