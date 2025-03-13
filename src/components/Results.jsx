const Results = ({ results, onLoadMore, onSelectCase }) => {
    return (
        <div>
            {results.length === 0 ? (
                <p className="text-gray-500">ไม่พบผลลัพธ์ โปรดลองพิมพ์ข้อความเพื่อค้นหา</p>
            ) : (
                <>
                    {results.map((result) => (
                        <div
                            key={result.id}
                            className="mb-6 p-6 border-2 border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-start gap-4 bg-white"
                        >
                            <img
                                src={result.icon}
                                alt="Category Icon"
                                className="w-16 h-16 object-cover rounded-full border border-gray-300"
                                onError={(e) => {
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/18604/18604453.png"; // Fallback image
                                }}
                            />
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{result.title}</h3>
                                <p className="text-gray-700 mb-2">{result.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-lg">{result.category}</span>
                                    <span className="text-sm text-gray-600">📚 {result.law}</span>
                                    <span className="text-sm text-gray-600">🔍 ค่าความคล้ายคลึง: {result.similarity.toFixed(4)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-between">                                
                                <div className="text-yellow-500 flex items-center mb-2">⭐ {result.rating.toFixed(1)}</div>
                                <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                                    onClick={() => onSelectCase(result)}>
                                    อ่าน →
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default Results;