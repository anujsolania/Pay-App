import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Signup } from "./components/Signup";
import { Signin } from "./components/Signin";
import { Dashboard } from "./components/Dashboard";
import { Sendmoney } from "./components/Sendmoney";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "./components/ProtectRoute/ProtectedRoute";
import Addmoney from "./components/Addmoney";
import { useEffect, useState } from "react";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return (
    <>
      {isMobile && !dismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center flex flex-col gap-4">
            <div className="text-4xl">💻</div>
            <h2 className="text-xl font-bold text-gray-800">Best on Desktop</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Pay-App is designed for larger screens. For the best experience,
              please open it on a desktop or laptop browser.
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/addmoney" element={<Addmoney />}></Route>
          <Route path="/sendmoney/:rId" element={<Sendmoney />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
