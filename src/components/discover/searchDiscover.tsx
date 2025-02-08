import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchDiscover({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Pass search query to parent
  };

  return (
    <div className="relative w-full max-w-[616px] mb-6">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search events..."
        className="w-full px-4 py-2 bg-transparent border-gray-800 text-white outline-black rounded-lg shadow-md placeholder-gray-400 "
      />
    </div>
  );
}
