import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ProtectedRoute from "./Services/PortectedRoute";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute>
                <div className="flex flex-col">
                  <Navbar />
                  <Home />
                </div>
              </ProtectedRoute>
            }
          />

        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
