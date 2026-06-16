import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Test Runs", path: "/tests" },
    { name: "Bugs", path: "/bugs" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside
      style={{
        width: "250px",
        background: "#1E293B",
        color: "#fff",
        minHeight: "100vh",
        padding: "25px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>QA Dashboard</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => (
          <li key={item.path} style={{ marginBottom: "15px" }}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                color: isActive ? "#38BDF8" : "#fff",
                textDecoration: "none",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
