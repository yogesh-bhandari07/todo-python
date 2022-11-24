import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
function App() {
  return (
    <>
      <div className="flex flex-col">
        <Navbar />
        <Home />
      </div>
    </>
  );
}

export default App;
