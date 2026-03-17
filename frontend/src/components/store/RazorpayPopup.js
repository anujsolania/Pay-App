import axios from "axios";
import { toast } from "react-toastify";

const openRazorpay = (data, navigate) => {
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
          `${import.meta.env.VITE_URL}/api/v1/account/verify-payment`,
          response,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (res.data.success) {
          toast.info("Payment received, verifying...");
        } else {
          alert("Payment verification failed");
        }
        navigate("/dashboard");
      } catch (error) {
        console.error("Error verifying payment:", error);
        alert("An error occurred during payment verification");
      }
    },
    modal: {
      ondismiss: async function () {
        //send orderId to backend to mark transaction as cancelled

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_URL}/api/v1/account/payment-cancel`,
            {
              orderId: data.order.id,
            },
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
          toast.info(res.data.mssg);
        } catch (error) {
          console.error("Error cancelling payment:", error);
          toast.error("Error cancelling payment");
        }
        navigate("/dashboard");
      },
    },
    theme: {
      color: "#111",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

export default openRazorpay;
