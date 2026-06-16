const StatCard = ({ title, value, color }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "25px",
        borderTop: `5px solid ${color}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h4
        style={{
          color: "#666",
          marginBottom: "10px",
        }}
      >
        {title}
      </h4>

      <h1>{value}</h1>
    </div>
  );
};

export default StatCard;
