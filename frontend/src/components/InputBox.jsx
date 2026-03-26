export function InputBox({ label, placeholder, onChange }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-medium mb-1">{label}</div>
      <input
        onChange={onChange}
        type="text"
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded border-gray-300"
      />
    </div>
  );
}