import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function Send() {
  const [amount, setAmount] = useState("");
  const [executeAt, setExecuteAt] = useState("");
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name= searchParams.get("name");
  
  async function handleSchedule() {
  if (!amount || Number(amount) <= 0) {
    alert("Enter valid amount");
    return;
  }

  if (!executeAt) {
    alert("Select date and time");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/v1/scheduled-payments",
      {
        toUserId: id,
        amount: Number(amount),
        executeAt: new Date(executeAt).toISOString()
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    alert("Payment scheduled successfully");
  } catch (err) {
    console.log(err.response?.data);
    alert("Scheduling failed");
  }
}

  async function handleTransfer() {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/v1/account/transfer",
        {
          to: id,
          amount: Number(amount),
          type: typeof amount
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      alert("Transfer successful");

    } catch (err) {
  console.log(err.response?.data);
}

    }
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white w-96 rounded-2xl shadow-lg p-6">
        
        
        <h2 className="text-2xl font-semibold text-center mb-6">
          Send Money
        </h2>

        
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-full">
            {name[0].toUpperCase()}
          </div>
          <p className="text-lg font-medium">{name}</p>
        </div>

        
        <div className="mb-4">
          <label className="text-sm text-gray-600">
            Amount (in Rs)
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="mb-4">
        <label className="text-sm text-gray-600">
        Schedule (optional)
        </label>
        <input
        type="datetime-local"
        value={executeAt}
        onChange={(e) => setExecuteAt(e.target.value)}
        className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        </div>

        
        <button
          onClick={handleTransfer}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition"
        >
          Initiate Transfer
        </button>
      </div>
    </div>
  );
}
