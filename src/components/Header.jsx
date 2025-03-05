import { useState } from "react";
import { FaBalanceScale, FaBook, FaFire } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { AiOutlineInfoCircle, AiOutlineClose } from "react-icons/ai";

const categories = [
  {
    name: "หมวดหมู่กฎหมายว่าด้วยหนี้",
    description: "กฎหมายเกี่ยวกับ",
  },
  {
    name: "หมวดหมู่กฎหมายว่าด้วยสัญญา",
    description: "กฎหมายเกี่ยวกับ",
  },
  {
    name: "หมวดหมู่กฎหมายว่าทรัพย์สิน",
    description: "กฎหมายเกี่ยวกับ",
  },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleBookClick = () => {
    window.open("https://www.drthawip.com/civilandcommercialcode/004", "_blank");
  };

  return (
    <header className="bg-white p-4 shadow-md rounded-b-[30px] relative z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Menu Icon and Logo */}
        <div className="flex items-center space-x-2">
          {/* Left Menu Icon */}
          <button className="text-gray-700 text-2xl" onClick={() => setMenuOpen(true)}>
            <HiOutlineMenu />
          </button>

          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <FaBalanceScale className="text-black text-2xl" />
            <span className="font-bold text-lg">LEGAL SEARCH</span>
          </div>
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center space-x-4">
          {/* Fire Icon */}
          <button className="p-2 rounded-full hover:bg-gray-200">
            <FaFire className="text-red-500 text-xl" />
          </button>
          {/* Book Icon */}
          <button className="p-2 rounded-full hover:bg-gray-200" onClick={handleBookClick}>
            <FaBook className="text-gray-700 text-xl" />
          </button>
          {/* Information Icon */}
          <div className="relative group inline-block">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <AiOutlineInfoCircle className="text-gray-700 text-xl" />
            </button>
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <p>เล่าเรื่องราวของคุณ เช่น "..."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar เมนูเต็มซ้าย */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex">
          <div className="w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">หมวดหมู่กฎหมาย</h2>
              <button className="text-gray-700 text-2xl" onClick={() => setMenuOpen(false)}>
                <AiOutlineClose />
              </button>
            </div>
            <ul className="mt-4">
              {categories.map((category, index) => (
                <li key={index}>
                  <button
                    className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* ปิดเมนูโดยกดข้างนอก */}
          <div className="flex-1" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* Popup แสดงข้อมูล */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h1 className="text-xl font-bold mb-2">{selectedCategory.name}</h1>
            <p className="text-gray-700">{selectedCategory.description}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => setSelectedCategory(null)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
