import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";

interface SelectProps {
  value: string | number;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  currencyList: string[];
}
const Select = ({ value, setValue, currencyList }: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref} onClick={() => setIsOpen(!isOpen)} className="md:absolute md:right-3 md:bottom-8 md:z-[1] ">
      <div className="bg-white pl-4 pr-2 py-2 rounded-full w-full md:w-36 flex items-center justify-between cursor-pointer shadow-lg border">
        {value}
        <ChevronDown className={`transform transition-all ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <div className="overflow-auto max-h-[22rem] absolute left-0 bottom-full w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
          {currencyList.map((currency, index) => (
            <div
              key={index}
              onClick={() => {
                setValue(currency);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
                value === currency ? "bg-gray-100" : ""
              }`}
            >
              {currency}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
