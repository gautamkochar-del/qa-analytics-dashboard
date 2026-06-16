import Layout from "../components/Layout/Layout";
import StatCard from "../components/Dashboard/StatCard";

const Dashboard = () => {
  return (
    <Layout>
      <h1>Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <StatCard title="Total Tests" value="1520" />
        <StatCard title="Passed" value="1462" />
        <StatCard title="Failed" value="58" />
        <StatCard title="Open Bugs" value="17" />
      </div>
    </Layout>
  );
};

export default Dashboard;
