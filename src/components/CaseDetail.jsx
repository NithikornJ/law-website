// import { useParams } from "react-router-dom";

// const CaseDetail = () => {
//     const { id } = useParams();

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold text-gray-900">รายละเอียดคดี #{id}</h2>
//             <p className="text-gray-700 mt-4">
//                 ข้อมูลของคดีที่มี ID = {id} จะแสดงที่นี่ (สามารถดึงข้อมูลจาก API หรือ database)
//             </p>
//         </div>
//     );
// };

// export default CaseDetail;


// import { useParams } from "react-router-dom";

// const CaseDetail = () => {
//     const { id } = useParams();

//     // สมมติว่ามีข้อมูล mock (คุณอาจโหลดจาก API จริง)
//     const mockCaseData = [
//         { id: "1", title: "คดีหนี้สิน", description: "โจทย์ฟ้องจำเลยเรื่องการผิดสัญญาเงินกู้", caseNumber: "ฎีกาที่ 123/2565", law: "มาตรา 194", facts: "จำเลยไม่ได้ชำระหนี้ตามกำหนด", relatedSections: "มาตรา 194, 195" },
//         { id: "2", title: "คดีที่ดิน", description: "ข้อพิพาทเกี่ยวกับกรรมสิทธิ์ที่ดิน", caseNumber: "ฎีกาที่ 456/2565", law: "มาตรา 1298", facts: "จำเลยอ้างสิทธิ์เหนือที่ดินของโจทก์", relatedSections: "มาตรา 1298, 1299" },
//     ];

//     const caseData = mockCaseData.find(item => item.id === id);

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-4">{caseData?.title}</h1>
//             <p className="text-gray-700 mb-4">{caseData?.description}</p>

//             <div className="border p-4 rounded-lg bg-white shadow">
//                 <p><strong>เลขที่ฎีกา:</strong> {caseData?.caseNumber}</p>
//                 <p><strong>กฎหมายแพ่งและพาณิชย์:</strong> {caseData?.law}</p>
//                 <p><strong>ข้อเท็จจริง:</strong> {caseData?.facts}</p>
//                 <p><strong>มาตราที่เกี่ยวข้อง:</strong> {caseData?.relatedSections}</p>
//             </div>
//         </div>
//     );
// };

// export default CaseDetail;




// import { useParams } from 'react-router-dom';

// const CaseDetail = () => {
//     const { id } = useParams();
//     // โหลดข้อมูลคดีโดยใช้ id ที่ได้รับมา
//     const caseData = mockCaseData.find(item => item.id === id);

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-4">{caseData?.title}</h1>
//             <p className="text-gray-700 mb-4">{caseData?.description}</p>

//             <div className="border p-4 rounded-lg bg-white shadow">
//                 <p><strong>เลขที่ฎีกา:</strong> {caseData?.caseNumber}</p>
//                 <p><strong>กฎหมายแพ่งและพาณิชย์:</strong> {caseData?.law}</p>
//                 <p><strong>ข้อเท็จจริง:</strong> {caseData?.facts}</p>
//                 <p><strong>มาตราที่เกี่ยวข้อง:</strong> {caseData?.relatedSections}</p>
//             </div>
//         </div>
//     );
// };

// export default CaseDetail;

import { useState } from "react";

const CaseDetail = ({ caseData, onBack }) => {
    const [rating, setRating] = useState(4); // ค่าดาวเริ่มต้น

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto mt-10">
            {/* ปุ่มย้อนกลับ */}
            <button
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center mb-4"
                onClick={onBack}
            >
                ← ย้อนกลับ
            </button>


            {/* ช่องแสดงข้อมูล */}
            <div className="space-y-4">
                <div>
                    <label className="font-bold text-gray-700">เลขที่ฎีกา :</label>
                    <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">{"-"}</div>
                </div>

                <div>
                    <label className="font-bold text-gray-700">กฎหมายแพ่งและพาณิชย์ :</label>
                    <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">{ "-"}</div>
                </div>

                <div>
                    <label className="font-bold text-gray-700">ข้อเท็จจริง :</label>
                    <div className="border border-gray-300 p-3 rounded-lg bg-gray-50 h-32 overflow-y-auto">{ "-"}</div>
                </div>

                <div>
                    <label className="font-bold text-gray-700">มาตราที่เกี่ยวข้อง :</label>
                    <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">{ "-"}</div>
                </div>
            </div>

            {/* ระบบให้ดาว */}
            <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-gray-600">ความพึงพอใจกับการค้นหา (มีความใกล้เคียงมาก 1 - 5)</p>
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
            </div>
        </div>
    );
};

export default CaseDetail;
