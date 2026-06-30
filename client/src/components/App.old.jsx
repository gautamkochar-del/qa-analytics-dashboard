import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import Tests from "./pages/Tests";
import Bugs from "./pages/Bugs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// inside <Routes>
<Route path="/tests" element={<Tests />} />
<Route path="/bugs" element={<Bugs />} />
<Route path="/reports" element={<Reports />} />
<Route path="/settings" element={<Settings />} />

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
