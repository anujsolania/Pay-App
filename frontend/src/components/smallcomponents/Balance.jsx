import { useContext } from "react";
import { MyContext } from "../store/Context";
import { useNavigate } from "react-router-dom";

export function Balance() {
  const navigate = useNavigate();

  const { balance } = useContext(MyContext);

  return (
    <div className="flex items-center justify-between font-semibold text-xl my-[4%] px-[2%] ">
      <h1>Your Balance ₹{balance}</h1>
      <button
        className="rounded bg-blue-500 text-white px-3 py-1 font-medium text-lg hover:bg-blue-600"
        onClick={() => {
          navigate("/addmoney");
        }}
      >
        Add Money
      </button>
    </div>
  );
}
