export function InputBox({ label, placeholder, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-surface-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}
