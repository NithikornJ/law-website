import { useState } from "react";

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

export default function CategoryButtons() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="w-1/4">
      {/* ปุ่มหมวดหมู่ */}
      <div className="flex flex-col gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className="bg-white text-gray-800 border border-gray-300 p-4 rounded-lg text-left shadow-md hover:bg-gray-100 transition duration-200 w-full"
            onClick={() => setSelectedCategory(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

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
    </div>
  );
}
