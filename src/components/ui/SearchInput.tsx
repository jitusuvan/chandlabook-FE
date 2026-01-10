import { FaSearch } from "react-icons/fa";

type SearchInputProps = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const SearchInput = ({
  placeholder = "Search...",
  value,
  onChange,
  className = ""
}: SearchInputProps) => {
  return (
    <div className={`position-relative ${className}`}>
      <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
      <input
        className="form-control form-control-lg ps-5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;