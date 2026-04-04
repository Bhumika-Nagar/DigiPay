export function InputBox({
  label,
  placeholder,
  onChange,
  type = "text",
  value = "",
}) {
  return (
    <label className="field">
      <span className="field__label">
        {label}
      </span>
      <input
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="field__input"
        value={value}
      />
    </label>
  );
}
