import { useEffect, useState } from "react";
import CardWrapper from "../Common/CardWrapper";
import DataTable from "../Common/DataTable";
import { getDashboardData } from "../../services/dashboardService";

export default function CriticalBugs() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getDashboardData();

      setRows(
        data.bugs.map((bug, index) => ({
          id: index + 1, ...bug, }))
      );
    }

    load();
  }, []);

  const columns = [
    { field: "id", headerName: "#", width: 70 }, { field: "title", headerName: "Bug", flex: 1 }, { field: "severity", headerName: "Severity", width: 140 }, { field: "status", headerName: "Status", width: 150 }, ];

  return (
    <CardWrapper title="Critical Bugs">
      <DataTable rows={rows} columns={columns} />
    </CardWrapper>
  );
}
