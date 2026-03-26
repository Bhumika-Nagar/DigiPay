export function Button({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800"
    >
      {label}
    </button>
  );
}