import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProfileSelection } from "./components/ProfileSelection";
import { RulesPage } from "./components/RulesPage";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export const App = () => {
  return (
    <ConvexProvider client={convex}>
      <Router>
        <Routes>
          <Route path="/" element={<ProfileSelection />} />
          <Route path="/rules" element={<RulesPage />} />
        </Routes>
      </Router>
    </ConvexProvider>
  );
};
