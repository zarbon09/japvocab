import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ScenePage from "./pages/ScenePage";
import PracticePage from "./pages/PracticePage";
import ReviewPage from "./pages/ReviewPage";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <h1>Mira</h1>
          <span>見る · visual Japanese vocab</span>
        </NavLink>
        <nav className="nav-pills">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Scenes
          </NavLink>
          <NavLink to="/review" className={({ isActive }) => (isActive ? "active" : "")}>
            Review
          </NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scene/:id" element={<ScenePage />} />
        <Route path="/scene/:id/practice" element={<PracticePage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </div>
  );
}
