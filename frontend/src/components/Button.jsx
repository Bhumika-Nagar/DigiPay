function Button({ text, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-white py-2 rounded-lg font-medium transition ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;