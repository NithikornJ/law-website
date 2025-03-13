import { useState, useEffect } from "react";

const CaseDetail = ({ caseData, onBack }) => {
    const [rating, setRating] = useState(4);
    const [loading, setLoading] = useState(true);
    const [fullCaseText, setFullCaseText] = useState("");
    const [sections, setSections] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("success");

    useEffect(() => {
        const fetchCaseDetails = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/get_case_details/?case_id=${caseData.id}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setFullCaseText(data.full_case_text);
                setSections(data.sections);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching case details:", error);
                setLoading(false);
            }
        };

        if (caseData) {
            fetchCaseDetails();
        }
    }, [caseData]);

    const submitRating = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/submit_rating/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    search_query: caseData.searchQuery,
                    case_id: caseData.id,
                    rating_value: rating,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit rating");
            }

            const data = await response.json();
            console.log("Rating submitted successfully:", data);

            setPopupMessage("ส่งคะแนนสำเร็จ!");
            setPopupType("success");
            setShowPopup(true);

            setTimeout(() => {
                console.log("Closing popup");
                setShowPopup(false);
            }, 3000);
        } catch (error) {
            console.error("Error submitting rating:", error);

            setPopupMessage("ส่งคะแนนไม่สำเร็จ กรุณาลองอีกครั้ง");
            setPopupType("danger");
            setShowPopup(true);

            setTimeout(() => {
                console.log("Closing popup");
                setShowPopup(false);
            }, 3000);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full mx-auto mt-10">
            <button
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center mb-4"
                onClick={onBack}
            >
                ← ย้อนกลับ
            </button>

            {loading ? (
                <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300">
                        <div className="flex items-center">
                            <label className="font-bold text-gray-700 mr-2">เลขที่ฎีกา :</label>
                            <p className="text-gray-700">{caseData?.id || "-"}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300">
                        <div className="flex items-center">
                            <label className="font-bold text-gray-700 mr-2">กฎหมายแพ่งและพาณิชย์ :</label>
                            <p className="text-gray-700">{caseData?.category || "-"}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300">
                        <div className="items-center">
                            <label className="font-bold text-gray-700 mr-2">ข้อเท็จจริง :</label>
                            <p className="text-gray-700">{fullCaseText || "-"}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300">
                        <div className="flex items-center">
                            <label className="font-bold text-gray-700 mr-2">มาตราที่เกี่ยวข้อง :</label>
                            <p className="text-gray-700">{sections ? sections.join(", ") : "-"}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-600">ความพึงพอใจกับการค้นหา (มีความใกล้เคียงมาก 1 - 5)</p>
                <div className="flex items-center space-x-4">
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-2xl transition ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <div>
                        <button onClick={submitRating} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center mb-4">
                            ส่ง
                        </button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div 
                    className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-sm rounded-xl ${popupType === "success" ? "bg-emerald-50 border border-emerald-400" : "bg-red-500"} mt-4`} 
                    style={{ zIndex: 1000 }} // เพิ่ม z-index
                    role="alert"
                >
                    <h3 className={`${popupType === "success" ? "text-emerald-500" : "text-white"} font-normal`}>
                        <span className="font-semibold mr-1">{popupType === "success" ? "Success" : "Danger"}</span>
                        {popupMessage}
                    </h3>
                    <p className={`mt-1 ${popupType === "success" ? "text-gray-600" : "text-white/80"}`}>
                        {popupType === "success" ? "ขอบคุณสำหรับการให้คะแนน" : "กรุณาลองอีกครั้ง"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CaseDetail;