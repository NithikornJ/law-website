from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# โหลดโมเดล SBERT ที่ผ่านการ fine tuning
model = SentenceTransformer('Pornpan/sentenbert_finetuning_for_law')

def get_similarity(query: str, documents: list) -> list:
    # เข้ารหัสข้อความ query และ documents
    query_embedding = model.encode([query])
    document_embeddings = model.encode(documents)
    
    # คำนวณความคล้ายคลึง
    similarities = cosine_similarity(query_embedding, document_embeddings)
    
    # เรียงลำดับจากมากไปน้อยและ return ค่าคล้ายคลึง
    return similarities[0]

print("Model Loaded Successfully:", model)
print(model)