<button
  onClick={executeAt ? handleSchedule : handleTransfer}
  className={`w-full text-white py-2 rounded-lg font-medium transition ${
    executeAt
      ? "bg-blue-500 hover:bg-blue-600"
      : "bg-green-500 hover:bg-green-600"
  }`}
>
  {executeAt ? "Schedule Payment" : "Send Now"}
</button>