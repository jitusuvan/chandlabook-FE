import React, { useEffect, useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import useApi from "../../hooks/useApi";

interface PaginatedSearchSelectProps {
  api: string;
  getOptionLabel: (option: any) => string;
  onSelect: (option: any) => void;
  value?: any;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const PaginatedSearchSelect: React.FC<PaginatedSearchSelectProps> = ({
  api,
  getOptionLabel,
  onSelect,
  value = null,
  placeholder = "Search...",
  disabled = false,
  style,
}) => {
  const { GetPaginatedData } = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const inputValue = value ? getOptionLabel(value) : searchTerm;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const res = await GetPaginatedData(api, { search: searchTerm });
        setOptions(res.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, searchTerm, dropdownOpen]);

  useEffect(() => {
    if (dropdownOpen && value) {
      setSearchTerm(getOptionLabel(value));
    }
  }, [dropdownOpen, value, getOptionLabel]);

  return (
    <div className="position-relative" ref={ref} style={style}>
      <div className="position-relative">
        <input
          className="form-control form-control-lg rounded-4"
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          value={inputValue}
          onFocus={() => setDropdownOpen(true)}
          onChange={(e) => {
            const newValue = e.target.value;
            setSearchTerm(newValue);
            if (value) {
              onSelect(null);
            }
          }}
        />
        {inputValue && (
          <button
            type="button"
            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
            onClick={() => {
              setSearchTerm("");
              onSelect(null);
            }}
            style={{ border: 'none', background: 'none' }}
          >
            <FaTimes size={14} className="text-muted" />
          </button>
        )}
      </div>

      {dropdownOpen && (
        <div 
          className="position-absolute w-100 bg-white border rounded-3 shadow-sm mt-1"
          style={{ zIndex: 1050, maxHeight: '200px', overflowY: 'auto' }}
        >
          {loading && (
            <div className="p-3 text-center text-muted">
              <div className="spinner-border spinner-border-sm me-2" />
              Loading...
            </div>
          )}
          {!loading && options.length === 0 && (
            <div className="p-3 text-center text-muted">No results found</div>
          )}

          {options.map((opt: any, idx: number) => (
            <button
              key={opt.id || idx}
              type="button"
              className="btn btn-link w-100 text-start p-3 border-0 rounded-0"
              onClick={() => {
                onSelect(opt);
                setDropdownOpen(false);
                setSearchTerm("");
              }}
              style={{ textDecoration: 'none' }}
            >
              {getOptionLabel(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaginatedSearchSelect;