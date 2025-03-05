import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import Footer from "./components/Footer";
import CaseDetail from "./components/CaseDetail";
import CategoryButtons from "./components/CategoryButtons"; // ✅ เพิ่ม CategoryButtons

const App = () => {
    const [results, setResults] = useState([]);
    const [filters, setFilters] = useState({
        law: "ทั้งหมด",
        category: "ทั้งหมด",
    });
    const [selectedCase, setSelectedCase] = useState(null);

    const fetchResults = async () => {
        const mockResults = [
            { id: 1, title: "จ่ายหนี้ช้าเป็นอะไรมั้ย?", description: "ถ้าเราไม่มีเงินและจ่ายหนี้ช้าเป็นอะไรมั้ย?", category: "หนี้", law: "ประมวลกฎหมายแพ่งและพาณิชย์", rating: 5.0, icon: "https://cdn-icons-png.flaticon.com/512/18604/18604453.png", isHot: true },
            { id: 2, title: "ไปแอบชอบแฟนคนอื่นผิดมั้ย?", description: "ผมชอบผู้หญิงคนนึงแต่เขามีแฟนแล้ว", category: "สัญญา", law: "ประมวลกฎหมายแพ่งและพาณิชย์", rating: 4.5, icon: "https://cdn-icons-png.flaticon.com/512/18604/18604444.png", isHot: true },
            { id: 3, title: "ที่ดินโดนบุกรุกต้องทำยังไง?", description: "มีคนบุกรุกที่ดินของฉัน ฉันต้องจัดการอย่างไร?", category: "ทรัพย์สิน", law: "ประมวลกฎหมายแพ่งและพาณิชย์", rating: 4.8, icon: "https://cdn-icons-png.flaticon.com/512/18604/18604441.png", isHot: true },
        ];        

        const filteredResults = mockResults.filter((result) => {
            const matchLaw = filters.law === "ทั้งหมด" || result.law === filters.law;
            const matchCategory = filters.category === "ทั้งหมด" || result.category === filters.category;
            return matchLaw && matchCategory;
        });

        setResults(filteredResults);
    };

    useEffect(() => {
        fetchResults();
    }, [filters]);

    const handleSelectCase = (caseData) => {
        setSelectedCase(caseData);
    };

    const handleBack = () => {
        setSelectedCase(null);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="container mx-auto p-4">
                {selectedCase ? (
                    <CaseDetail caseData={selectedCase} onBack={handleBack} />
                ) : (
                    <>
                        <SearchBar onSearch={fetchResults} />
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
