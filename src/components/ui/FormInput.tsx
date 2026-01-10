type FormInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  maxLength?: number;
  name?: string;
};

const FormInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  maxLength,
  name,
}: FormInputProps) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-semibold">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control form-control-lg rounded-4 ${
          error ? "is-invalid" : ""
        }`}
      />

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput;
