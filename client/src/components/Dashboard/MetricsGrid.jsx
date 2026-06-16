import StatCard from "./StatCard";

const MetricsGrid = () => {
  const cards = [
    { title: "Total Tests", value: 1520, color: "#2563eb" },
    { title: "Passed", value: 1462, color: "#22c55e" },
    { title: "Failed", value: 58, color: "#ef4444" },
    { title: "Open Bugs", value: 17, color: "#f59e0b" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
      }}
    >
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default MetricsGrid;
