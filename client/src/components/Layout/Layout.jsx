import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex", background: "#f5f7fb", }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1, minHeight: "100vh", }}
      >
        <Navbar />

        <div
          style={{
            padding: "30px", }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
