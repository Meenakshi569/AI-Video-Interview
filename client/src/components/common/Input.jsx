export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  autoComplete,
}) {
  return (
    <div className={`form-field${error ? ' form-field--error' : ''}`}>
      {label && (
        <label htmlFor={id} className="form-field__label">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className="form-field__input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
