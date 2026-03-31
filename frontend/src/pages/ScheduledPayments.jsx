import { useState, useEffect } from "react";
import axios from "axios";

export default function ScheduledPayments() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/payment/ScheduledPayments", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setPayments(res.data.payments || []);
      console.log("response:", res.data);
console.log("payments:", res.data.payments);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  const cancelPayment = async (paymentId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/payment/cancel/${paymentId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      fetchPayments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Scheduled Payments
      </h2>

      <div className="space-y-4">
        {payments?.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">₹{p.amount}</p>
              <p className="text-sm text-gray-500">
                To: {p.toUserId
                ? `${p.toUserId.firstname} ${p.toUserId.lastname} (@${p.toUserId.username})`
                : "Unknown"}

              </p>
              <p className="text-sm text-gray-500">
                {p.executeAt ? new Date(p.executeAt).toLocaleString() : "No date"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div>
                {p.status === "pending" && (
                  <span className="text-yellow-600 font-medium">Pending</span>
                )}
                {p.status === "success" && (
                  <span className="text-green-600 font-medium">Success</span>
                )}
                {p.status === "failed" && (
                  <span className="text-red-600 font-medium">Failed</span>
                )}
                {p.status === "cancelled" && (
                  <span className="text-orange-600 font-medium">Cancelled</span>
                )}
              </div>

              {p.status === "pending" && (
                <button
                  onClick={() => cancelPayment(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
