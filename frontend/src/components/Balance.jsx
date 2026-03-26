export function Balance({ value }) {
  return (
    <div className="flex gap-2 p-4">
      <div className="font-semibold">Your balance</div>
      <div className="font-bold">Rs {value}</div>
    </div>
  );
}