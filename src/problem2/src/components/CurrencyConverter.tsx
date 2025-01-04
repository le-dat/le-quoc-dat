/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowDown } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Select from "./ui/Select";

const CurrencyConverter: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amountFrom, setAmountFrom] = useState<number | string>("");
  const [amountTo, setAmountTo] = useState<number | string>("");
  const [rates, setRates] = useState<Record<string, { price: number }> | null>(null);
  const [currencyList, setCurrencyList] = useState<string[]>([]);

  const apiUrl = "https://interview.switcheo.com/prices.json";

  // Debounced API Fetch Function
  const fetchRates = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const formatData: Record<string, { price: number }> = {};
      const currencyList = data?.map((item: any) => item?.currency) || [];

      data.forEach((item: any) => {
        formatData[item?.currency] = { price: item?.price };
      });

      setRates(formatData);
      setCurrencyList(currencyList);
      setFromCurrency(currencyList[0]);
      setToCurrency(currencyList[1]);
    } catch (error) {
      console.error("Failed to fetch rates:", error);
      alert("Could not fetch currency rates. Please try again.");
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchRates();
  }, []);

  const debounce = (callback: (...args: any[]) => void, delay: number) => {
    let timer: number;
    return (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  };

  // Debounced handler for user input
  const handleAmountFromChange = (value: string) => {
    setAmountFrom(value);
    if (value) debouncedFetchAndConvert(value, true);
  };

  const handleAmountToChange = (value: string) => {
    setAmountTo(value);
    if (value) debouncedFetchAndConvert(value, false);
  };

  const fetchAndConvert = useCallback(async (value: string, isFrom: boolean) => {
    await fetchRates(); // Re-fetch rates
    if (rates && fromCurrency && toCurrency) {
      const fromRate = rates[fromCurrency]?.price || 1;
      const toRate = rates[toCurrency]?.price || 1;
      if (isFrom) {
        const converted = (parseFloat(value) / fromRate) * toRate;
        setAmountTo(converted.toFixed(2));
      } else {
        const converted = (parseFloat(value) * fromRate) / toRate;
        setAmountFrom(converted.toFixed(2));
      }
    }
  }, [fetchRates, rates, fromCurrency, toCurrency]);

  const debouncedFetchAndConvert = debounce(fetchAndConvert, 500);

  return (
    <div className="max-w-lg w-full mx-auto p-6">
      <h1 className="text-2xl w-fit mb-7 mx-auto font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-brown-500 to-purple-500">
        Swap Application
      </h1>

      <div className="flex flex-col gap-4 relative mb-4">
        <div
          className={`flex relative flex-col hover:shadow-xl px-4 pt-5 pb-8 gap-y-4 border rounded-2xl shadow-lg bg-white`}
        >
          <label htmlFor="amountFrom" className="block text-gray-700 font-medium">
            Amount From
          </label>
          <input
            type="number"
            id="amountFrom"
            value={amountFrom}
            onChange={(e) => handleAmountFromChange(e.target.value)}
            placeholder="Enter amount"
            className="block w-full pr-4 py-2 bg-transparent rounded-lg sm:text-base focus:outline-none focus:border-0"
          />

          <Select value={fromCurrency} setValue={setFromCurrency} currencyList={currencyList} />
        </div>

        <div className="p-3 border absolute bg-white shadow-md rounded-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1]">
          <ArrowDown />
        </div>

        <div
          className={`flex relative flex-col hover:shadow-xl px-4 pt-5 pb-8 gap-y-4 border rounded-2xl shadow-lg bg-white`}
        >
          <label htmlFor="amountTo" className="block text-gray-700 font-medium mb-2">
            Amount To
          </label>
          <input
            type="number"
            id="amountTo"
            value={amountTo}
            onChange={(e) => handleAmountToChange(e.target.value)}
            placeholder="Converted amount"
            className="block w-full pr-4 py-2 bg-transparent rounded-lg sm:text-base focus:outline-none focus:border-0"
          />

          <Select value={toCurrency} setValue={setToCurrency} currencyList={currencyList} />
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
