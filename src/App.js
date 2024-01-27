import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import NotFound from "./screens/NotFound";
import Quiz from "./screens/Quiz";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
