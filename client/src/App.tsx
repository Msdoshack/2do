import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Todos from "./pages/Todos";
// import SingleTodo from "./pages/SingleTodo";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotProtectedRoutes from "./components/NotProtectedRoutes";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route element={<NotProtectedRoutes />}>
          <Route path="/" element={<Home />} />

          <Route path="/sign-in" element={<SignIn />} />

          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Todos />} />

          {/* <Route path="/todos/:todoId" element={<SingleTodo />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
