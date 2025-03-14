from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from rapidfuzz import process
import database  # Import database connection
import logging
from database import get_db  # Import your database connection function
from fuzzywuzzy import process
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Pydantic model for user input
class QuestionRequest(BaseModel):
    question: str

# Fetch FAQs from the database


def get_faqs():
    conn = get_db()
    if not conn:
        return {}

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT question, answer FROM faqs")
            rows = cur.fetchall()
            return {row["question"]: row["answer"] for row in rows}
    except Exception as e:
        print("Database error:", e)
        return {}
    finally:
        conn.close()

@app.post("/chat")
def chat_response(request: QuestionRequest):
    faqs = get_faqs()  # Fetch FAQs from the database
    question = request.question.lower()
    
    if not faqs:
        return {"answer": "I'm sorry, I don't have any answers right now."}
    
    # Find the best matching FAQ
    best_match, score = process.extractOne(question, faqs.keys()) if faqs else (None, 0)

    if best_match and score > 70:
        return {"answer": faqs[best_match]}
    else:
        return {"answer": "I'm sorry, I don't have an answer to that right now."}


# API to get common questions
@app.get("/common_questions")
def common_questions():
    faqs = get_faqs()
    return {"questions": list(faqs.keys())}

# Enable logging to see errors
logging.basicConfig(level=logging.DEBUG)

@app.get("/")
def home():
    return {"message": "Chatbot API is running!"}
# Get PORT from environment variables (default to 9090)
PORT = int(os.getenv("PORT", 9090))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)

@app.post("/test")
def test_endpoint():
    return {"message": "Test endpoint is working"}

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

