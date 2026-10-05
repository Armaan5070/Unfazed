import api from "../../api/axiosInstance"
export default function Payment(){
    const handlePayment = async (appointmentId) => {
    try {
        // 1. Ask backend to create Razorpay order
        const response = await api.post("/create-order", {
            appointmentId
        });

        const {
            orderId,
            amount,
            currency
        } = response.data;

        // 2. Razorpay checkout configuration
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,

            amount: amount * 100,
            currency: currency,

            name: "Unfazed",
            description: "Therapy Session",

            order_id: orderId,

            handler: function (paymentResponse) {
                console.log("Payment completed:", paymentResponse);
            },

            theme: {
                color: "#000000"
            }
        };

        // 3. Open Razorpay
        const razorpay = new window.Razorpay(options);

        razorpay.open();

    } catch (error) {
        console.error("Payment error:", error);
    }
};
    return(
        <>
        <button onClick={()=>{handlePayment("6a96e07e3a2488decfe1008a")}}>
            Pay ₹1000
        </button>
        </>
    )
}
