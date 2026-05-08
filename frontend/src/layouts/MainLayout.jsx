import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 min-h-[80vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
