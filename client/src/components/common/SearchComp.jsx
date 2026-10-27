import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import debounce from "lodash.debounce";

export const SearchComp = ({ onSearch, onFilter, categories = [], resetSignal = 0 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");

  const debouncedSearch = React.useMemo(
    () =>
      debounce((term) => {
        onSearch(term);
      }, 500),
    [onSearch],
  );

  React.useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);
  React.useEffect(() => {
    debouncedSearch.cancel();
    setSearchTerm("");
    setCategory("all");
    setLevel("all");
  }, [debouncedSearch, resetSignal]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    onFilter({ category: val, level });
  };

  const handleLevelChange = (e) => {
    const val = e.target.value;
    setLevel(val);
    onFilter({ category, level: val });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
      {/* Search Bar */}
      <div className="relative w-full md:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for courses..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C1E53]/20 focus:border-[#1C1E53] transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4 w-full md:w-auto">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C1E53]/20 bg-white text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((value) => <option value={value} key={value}>{value}</option>)}
          </select>
        </div>

        <select
          value={level}
          onChange={handleLevelChange}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C1E53]/20 bg-white text-sm"
        >
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
    </div>
  );
};
