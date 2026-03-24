import axios from "axios";
import { useContext, useState } from "react";
import openRazorpay from "./store/RazorpayPopup";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./store/Context";

const Addmoney = () => {
  const { fetchData, balance, PollingforBalanceUpdate } = useContext(MyContext);
  const [amt, setamt] = useState("");
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const handleAddMoney = async () => {
    if (!amt || Number(amt) <= 0 || Number(amt) < 1) {
      alert("Please enter a valid amount");
      setloading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/account/add-money`,
        {
          amount: Number(amt),
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      console.log(response.data);

      const oldBalance = balance;
      openRazorpay(
        response.data,
        navigate,
        oldBalance,
        PollingforBalanceUpdate
      );

      setloading(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.mssg || "Something went wrong - addmoney");
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-300 flex justify-center items-center">
      <div className="w-full bg-gray-200 max-w-md p-10 flex flex-col rounded-lg shadow-lg gap-10">
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Add Money Page
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold">Amount (in Rs)</h1>
          <input
            type="text"
            placeholder="Enter Amount to Add"
            className="border rounded px-2 py-1 w-full mb-4"
            value={amt}
            onChange={(e) => setamt(e.target.value)}
          ></input>
          <button
            className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={() => {
              setloading(true);
              handleAddMoney();
            }}
          >
            {loading ? "Proceeding" : "Proceed to Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addmoney;
