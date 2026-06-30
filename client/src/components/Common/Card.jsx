const Card = ({ title, children }) => {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default Card;
