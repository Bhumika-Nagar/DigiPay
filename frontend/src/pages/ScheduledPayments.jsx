import { useState, useEffect } from "react";
import axios from "axios";

export default function ScheduledPayments() {

const [payments, setPayments] = useState([]);
useEffect(() => {
  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/payment/ScheduledPayments", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log("API:", res.data);

      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err);
    }
  };
  
  fetchPayments();

  const interval = setInterval(fetchPayments, 5000);

  return () => clearInterval(interval);
}, []);

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
              {p.executeAt ? new Date(p.executeAt).toLocaleString() : "No date"}
            </p>
          </div>

          <div>
            {p.status === "pending" && (
              <span className="text-yellow-600 font-medium">Pending</span>
            )}
            {p.status === "completed" && (
              <span className="text-green-600 font-medium">Completed</span>
            )}
            {p.status === "failed" && (
              <span className="text-red-600 font-medium">Failed</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
}