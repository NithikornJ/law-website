import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import Footer from "./components/Footer";
import CaseDetail from "./components/CaseDetail";
import CategoryButtons from "./components/CategoryButtons";

const App = () => {
    const [results, setResults] = useState([]);
    const [filters, setFilters] = useState({
        law: "ทั้งหมด",
        category: "ทั้งหมด",
    });
    const [selectedCase, setSelectedCase] = useState(null);
    const [categories, setCategories] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลหมวดหมู่
    const [searchQuery, setSearchQuery] = useState(""); // เพิ่ม State สำหรับเก็บ searchQuery

    // ดึงข้อมูลหมวดหมู่จาก API
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/get_categories/`);
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await response.json();
            setCategories(data); // เก็บข้อมูลหมวดหมู่ใน state
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchAverageRatings = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/get_average_ratings/`);
            if (!response.ok) {
                throw new Error("Failed to fetch average ratings");
            }
            const data = await response.json();
            return data.average_ratings;
        } catch (error) {
            console.error("Error fetching average ratings:", error);
            return {};
        }
    };

    // ฟังก์ชันสำหรับเรียกใช้ API เพื่อค้นหาคดีที่คล้ายกัน
    const fetchResults = async (query = "") => {
        try {
            // เรียกใช้ API ที่คุณสร้างไว้ใน main.py
            const response = await fetch(`${process.env.REACT_APP_API_URL}/search_cases/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_input: query }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const averageRatings = await fetchAverageRatings();

            // แปลงข้อมูลจาก API ให้ตรงกับโครงสร้างที่ใช้ใน Results component
            const formattedResults = data.cases.map((caseData, index) => {
                // ค้นหาข้อมูลหมวดหมู่จาก categories โดยใช้ category_id
                const categoryInfo = categories.find((cat) => cat.category_id === caseData.category_id) || {};
                return {
                    id: caseData.case_id, // ใช้ case_id เป็น id
                    title: `คดีที่ ${index + 1}: ${caseData.case_id || "ไม่ระบุหมวดหมู่"}`, // ใช้ category_name เป็นส่วนหนึ่งของ title
                    description: caseData.case_text, // ใช้ case_text เป็น description
                    category: categoryInfo.category_name || "ไม่ระบุหมวดหมู่", // ใช้ category_name จาก API
                    law: "ประมวลกฎหมายแพ่งและพาณิชย์", // ข้อมูลนี้สามารถปรับเปลี่ยนตามข้อมูลจริงจาก API
                    rating: averageRatings[caseData.case_id] || 0.0, // ข้อมูลนี้สามารถปรับเปลี่ยนตามข้อมูลจริงจาก API
                    icon: categoryInfo.icon_url || "https://cdn-icons-png.flaticon.com/512/18604/18604453.png", // ใช้ icon_url จาก API
                    isHot: true, // ข้อมูลนี้สามารถปรับเปลี่ยนตามข้อมูลจริงจาก API
                    similarity: caseData.similarity,
                };
            });

            // กรองผลลัพธ์ตาม filters (ถ้ามี)
            const filteredResults = formattedResults.filter((result) => {
                const matchLaw = filters.law === "ทั้งหมด" || result.law === filters.law;
                const matchCategory = filters.category === "ทั้งหมด" || result.category === filters.category;
                return matchLaw && matchCategory;
            });

            setResults(filteredResults);
        } catch (error) {
            console.error("Error fetching results:", error);
        }
    };

    // เรียกใช้ fetchCategories เมื่อ Component โหลด
    useEffect(() => {
        fetchCategories();
    }, []);

    // เรียกใช้ fetchResults เมื่อ filters เปลี่ยนแปลง
    useEffect(() => {
        // เรียก fetchResults เมื่อ filters เปลี่ยนแปลง
        if (filters.law !== "ทั้งหมด" || filters.category !== "ทั้งหมด") {
            fetchResults();
        }
    }, [filters]);

    const handleSelectCase = (caseData) => {
        setSelectedCase({
            ...caseData, // ข้อมูลคดี
            searchQuery: searchQuery, // เพิ่ม searchQuery ใน caseData
        });
    };

    const handleBack = () => {
        setSelectedCase(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <div className="flex-1 container mx-auto p-4">
                {selectedCase ? (
                    <CaseDetail caseData={selectedCase} onBack={handleBack} />
                ) : (
                    <>
                        {/* ส่งฟังก์ชัน fetchResults และ setSearchQuery ไปยัง SearchBar */}
                        <SearchBar onSearch={(query) => { setSearchQuery(query); fetchResults(query); }} />
                        <div className="flex gap-4 mt-4">
                            {/* ✅ เพิ่ม CategoryButtons ทางซ้าย */}
                            <CategoryButtons />
                            
                            {/* ✅ Results ใช้พื้นที่ 3/4 */}
                            <div className="w-3/4 bg-white p-4 rounded-lg">
                                <Results results={results} onSelectCase={handleSelectCase} />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default App;