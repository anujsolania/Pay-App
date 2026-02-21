import axios from "axios";
import { toast } from "react-toastify";


const openRazorpay = (data,navigate) => {
  const options = {
    key: data.key,                
    amount: data.order.amount,   
    currency: "INR",
    name: "My Wallet",
    description: "Add Money",
    order_id: data.order.id,
    handler: async function (response) {
      // Send payment details to backend for verification
      try {
      const res = await axios.post(
          `${import.meta.env.VITE_URL}/api/v1/account/verify-payment`,response,
        {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }
      );

      if (res.data.success) {
        toast.success("Payment successful!");
        navigate("/dashboard");
      } else {
        alert("Payment verification failed");
        navigate("/dashboard");
      }
      } catch (error) {
        console.error("Error verifying payment:", error);
        alert("An error occurred during payment verification");
      }
    },
    modal: {
      ondismiss: function () {
        alert("Payment cancelled. No money was added to your wallet.");
        navigate("/dashboard");
      }
    },
    theme: {
      color: "#111",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

export default openRazorpay;