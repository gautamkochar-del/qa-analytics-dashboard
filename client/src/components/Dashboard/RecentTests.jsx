import { useEffect, useState } from "react";
import CardWrapper from "../Common/CardWrapper";
import DataTable from "../Common/DataTable";
import { getDashboardData } from "../../services/dashboardService";

export default function RecentTests() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getDashboardData();

      setRows(
        data.recentTests.map((test, index) => ({
          id: index + 1, ...test, }))
      );
    }

    load();
  }, []);

  const columns = [
    { field: "id", headerName: "#", width: 70 }, { field: "name", headerName: "Test Case", flex: 1 }, { field: "status", headerName: "Status", width: 130 }, { field: "executedBy", headerName: "Executed By", width: 180 }, ];

  return (
    <CardWrapper title="Recent Test Runs">
      <DataTable rows={rows} columns={columns} />
    </CardWrapper>
  );
}
