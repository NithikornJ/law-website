import { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (event) => {
        if (event) event.preventDefault(); // ป้องกันรีโหลดหน้า
        if (query.trim() !== "") {
            onSearch(query); // ส่ง query ไปยัง App.js
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch(event);
        }
    };

    return (
        <div className="bg-gray-100 py-6">
            <div className="container mx-auto flex justify-center items-center">
                <div className="relative w-4/5 max-w-6xl">
                    {/* Input Field */}
                    <input
                        type="text"
                        placeholder="ตัวอย่าง: จ่ายหนี้ช้าไป 1 อาทิตย์ จะเป็นไรไหม?"
                        className="border border-black rounded-full pl-6 pr-24 py-3 w-full text-gray-700 text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyPress} // ✅ กด Enter เพื่อค้นหา
                        aria-label="Search cases" // ✅ เพิ่ม label เพื่อการเข้าถึง
                    />

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-red-700 text-white p-4 rounded-full hover:bg-red-800 focus:outline-none"
                        aria-label="Search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;