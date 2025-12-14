import axios from "axios";


const openRazorpay = (data,navigate) => {
  const options = {
    key: data.key,                
    amount: data.amount,   
    currency: "INR",
    name: "My Wallet",
    description: "Add Money",
    order_id: data.orderId,
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
        alert("Money added successfully!");
        navigate("/dashboard");
      } else {
        alert("Payment verification failed");
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