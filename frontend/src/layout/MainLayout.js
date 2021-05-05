import React from "react";
import Navbar from "./Navbar/Navbar";
function MainLayout({ children }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}

export default MainLayout;
