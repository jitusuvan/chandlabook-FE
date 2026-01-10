type Option = {
  value: string;
  label: string;
};

type FormSelectProps = {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  name?: string;
  options: Option[];
  placeholder?: string;
};

const FormSelect = ({
  label,
  value,
  onChange,
  error,
  name,
  options,
  placeholder
}: FormSelectProps) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label fw-semibold">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select form-select-lg rounded-4 ${
          error ? "is-invalid" : ""
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormSelect;