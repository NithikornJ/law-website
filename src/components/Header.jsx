import { useState } from "react";
import { FaBalanceScale, FaBook, FaFire } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { AiOutlineInfoCircle, AiOutlineClose } from "react-icons/ai";



const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleBookClick = () => {
    window.open("https://www.drthawip.com/civilandcommercialcode/004", "_blank");
  };

  return (
    <header className="bg-white p-4 shadow-md rounded-b-[30px] relative z-10 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        {/* Left Section: Menu Icon and Logo */}
        <div className="flex items-center space-x-2">
          {/* Left Menu Icon */}
          <button className="text-gray-700 text-2xl" onClick={() => setMenuOpen(true)}>
            <HiOutlineMenu />
          </button>

          {/* Logo and Title */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.reload()}>
            <FaBalanceScale className="text-black text-2xl" />
            <span className="font-bold text-lg">LEGAL SEARCH</span>
          </div>
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* Book Icon */}
          <button className="p-2 rounded-full hover:bg-gray-200" onClick={handleBookClick}>
            <FaBook className="text-gray-700 text-xl" />
          </button>
          {/* Information Icon */}
          <div className="relative inline-block">
            <button className="group p-2 rounded-full hover:bg-gray-200">
              <AiOutlineInfoCircle className="text-gray-700 text-xl" />
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none flex flex-col">
                <p>แนะนำการใช้งานเว็บไซต์</p>
                <p>ยินดีต้อนรับสู่ระบบค้นหาคำตัดสินที่ใกล้เคียง!</p>
                <p>เพียงป้อนข้อมูลประเด็นทางกฎหมายที่คุณสงสัย / สนใจ ระบบจะช่วยค้นหาคำตัดสินที่เกี่ยวข้อง 🎯⚖️</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar เมนูเต็มซ้าย */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex">
          <div className="w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold"></h2>
              <button className="text-gray-700 text-2xl" onClick={() => setMenuOpen(false)}>
                <AiOutlineClose />
              </button>
            </div>
            <ul className="mt-4">              
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
