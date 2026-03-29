import { useState, useEffect } from "react";
const [payments, setPayments] = useState([]);
import axios from "axios";

useEffect(() => {
  const fetchPayments = async () => {
    try {
      const res = await axios.get("/api/v1/scheduled-payments", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setPayments(res.data.payments);
    } catch (err) {
      console.log(err);
    }
  };

  fetchPayments();

  const interval = setInterval(fetchPayments, 5000);

  return () => clearInterval(interval);
}, []);