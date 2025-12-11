const { default: axios } = require("axios");

const openRazorpay = (data) => {
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
        "http://localhost:5000/api/verify-payment",response,
        {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }
      );

      if (res.data.success) {
        alert("Money added successfully!");
        window.location.reload();
      } else {
        alert("Payment verification failed");
      }
      } catch (error) {
        console.error("Error verifying payment:", error);
        alert("An error occurred during payment verification");
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