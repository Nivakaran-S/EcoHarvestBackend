import os
import io
import json
import re
import logging
import tempfile
import base64
from uuid import uuid4
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image, UnidentifiedImageError
from dotenv import load_dotenv
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain.tools import Tool

from core.predict import ImageClassifier  # Assumed to be implemented

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(os.getcwd(), "model", "best_model.pth"))
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 5000))
PDF_PATH = os.getenv("PDF_PATH", "max3.pdf")

# Validate environment variables
if not all([HF_TOKEN, GROQ_API_KEY, MODEL_PATH, PDF_PATH]):
    logger.error("Missing required environment variables")
    raise RuntimeError("Environment variables not set")

# Initialize FastAPI app
app = FastAPI(
    title="EcoHarvest Combined API",
    description="API for food image classification and e-commerce assistance.",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to specific origins in production
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

# Food classification class names
class_name = {
    0: 'apple_pie',
    1: 'baby_back_ribs',
    2: 'baklava',
    3: 'beef_carpaccio',
    4: 'beef_tartare',
    5: 'beet_salad',
    6: 'beignets',
    7: 'bibimbap',
    8: 'bread_pudding',
    9: 'breakfast_burrito',
    10: 'bruschetta',
    11: 'caesar_salad',
    12: 'cannoli',
    13: 'caprese_salad',
    14: 'carrot_cake',
    15: 'ceviche',
    16: 'cheese_plate',
    17: 'cheesecake',
    18: 'chicken_curry',
    19: 'chicken_quesadilla',
    20: 'chicken_wings',
    21: 'chocolate_cake',
    22: 'chocolate_mousse',
    23: 'churros',
    24: 'clam_chowder',
    25: 'club_sandwich',
    26: 'crab_cakes',
    27: 'creme_brulee',
    28: 'croque_madame',
    29: 'cup_cakes',
    30: 'deviled_eggs',
    31: 'donuts',
    32: 'dumplings',
    33: 'edamame',
    34: 'eggs_benedict',
    35: 'escargots',
    36: 'falafel',
    37: 'filet_mignon',
    38: 'fish_and_chips',
    39: 'foie_gras',
    40: 'french_fries',
    41: 'french_onion_soup',
    42: 'french_toast',
    43: 'fried_calamari',
    44: 'fried_rice',
    45: 'frozen_yogurt',
    46: 'garlic_bread',
    47: 'gnocchi',
    48: 'greek_salad',
    49: 'grilled_cheese_sandwich',
    50: 'grilled_salmon',
    51: 'guacamole',
    52: 'gyoza',
    53: 'hamburger',
    54: 'hot_and_sour_soup',
    55: 'hot_dog',
    56: 'huevos_rancheros',
    57: 'hummus',
    58: 'ice_cream',
    59: 'lasagna',
    60: 'lobster_bisque',
    61: 'lobster_roll_sandwich',
    62: 'macaroni_and_cheese',
    63: 'macarons',
    64: 'miso_soup',
    65: 'mussels',
    66: 'nachos',
    67: 'omelette',
    68: 'onion_rings',
    69: 'oysters',
    70: 'pad_thai',
    71: 'paella',
    72: 'pancakes',
    73: 'panna_cotta',
    74: 'peking_duck',
    75: 'pho',
    76: 'pizza',
    77: 'pork_chop',
    78: 'poutine',
    79: 'prime_rib',
    80: 'pulled_pork_sandwich',
    81: 'ramen',
    82: 'ravioli',
    83: 'red_velvet_cake',
    84: 'risotto',
    85: 'samosa',
    86: 'sashimi',
    87: 'scallops',
    88: 'seaweed_salad',
    89: 'shrimp_and_grits',
    90: 'spaghetti_bolognese',
    91: 'spaghetti_carbonara',
    92: 'spring_rolls',
    93: 'steak',
    94: 'strawberry_shortcake',
    95: 'sushi',
    96: 'tacos',
    97: 'takoyaki',
    98: 'tiramisu',
    99: 'tuna_tartare',
    100: 'waffles'
}

# Initialize image classifier
try:
    classifier = ImageClassifier(model_path=MODEL_PATH, class_name=class_name)
    logger.info("Image classifier initialized successfully")
except Exception as e:
    logger.error(f"Failed to load image classifier model: {str(e)}")
    raise RuntimeError("Image classifier initialization failed")

# Initialize RAG components
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
llm = ChatGroq(model_name="Deepseek-R1-Distill-Llama-70b")
session_store = {}

def process_pdf(file_path: str):
    try:
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=500)
        splits = text_splitter.split_documents(documents)
        vectorstore = Chroma.from_documents(
            documents=splits,
            embedding=embeddings,
            persist_directory="./max.db"
        )
        logger.info(f"PDF {file_path} processed successfully")
        return vectorstore
    except Exception as e:
        logger.error(f"Failed to process PDF: {str(e)}")
        raise RuntimeError("PDF processing failed")

# Initialize vectorstore
try:
    vectorstore = process_pdf(PDF_PATH)
    retriever = vectorstore.as_retriever()
    logger.info("Vectorstore initialized successfully")
except Exception as e:
    logger.error(f"Vectorstore initialization failed: {str(e)}")
    raise RuntimeError("Vectorstore initialization failed")

# Define tools for e-commerce assistant
def get_customer_feedback(customerName: str, email: str, feedback: str) -> str:
    if not all(isinstance(x, str) for x in [customerName, email, feedback]):
        raise ValueError("All parameters must be strings")
    if "@" not in email or "." not in email.split("@")[-1]:
        raise ValueError("Invalid email format")
    return f"Feedback from {customerName} ({email}) recorded: {feedback[:200]}"

def calculate_math(expression: str) -> str:
    allowed_chars = set("0123456789+-*/(). ")
    if not all(c in allowed_chars for c in expression):
        raise ValueError("Invalid characters in expression")
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Calculation error: {str(e)}"

get_customer_feedback_tool = Tool(
    name="get_customer_feedback",
    func=get_customer_feedback,
    description="Record customer feedback. Parameters: customerName (string), email (string), feedback (string)."
)

calculate_math_tool = Tool(
    name="calculate_math",
    func=calculate_math,
    description="Perform math calculations. Parameters: expression (string)."
)

tools = [get_customer_feedback_tool, calculate_math_tool]

# Pydantic models
class PredictionResponse(BaseModel):
    label: str
    category: str
    output_image: Optional[str] = None  # Base64-encoded output image

class QuestionRequest(BaseModel):
    session_id: str
    question: str

class QuestionResponse(BaseModel):
    answer: str

class FoodCategory(BaseModel):
    label: str
    category: str

# Food categorization dictionary
food_categories = {
    "Meals & Main Courses": [
        'bibimbap', 'breakfast_burrito', 'chicken_curry', 'chicken_quesadilla', 'clam_chowder',
        'club_sandwich', 'croque_madame', 'dumplings', 'eggs_benedict', 'filet_mignon', 'fish_and_chips',
        'french_onion_soup', 'gyoza', 'hamburger', 'hot_and_sour_soup', 'hot_dog', 'huevos_rancheros',
        'lasagna', 'lobster_bisque', 'lobster_roll_sandwich', 'macaroni_and_cheese', 'miso_soup',
        'omelette', 'pad_thai', 'paella', 'peking_duck', 'pho', 'pizza', 'pork_chop', 'prime_rib',
        'pulled_pork_sandwich', 'spaghetti_bolognese', 'spaghetti_carbonara', 'tacos', 'takoyaki'
    ],
    "Baked Goods & Pastries": [
        'apple_pie', 'baklava', 'beignets', 'bread_pudding', 'cannoli', 'carrot_cake', 'chocolate_cake',
        'churros', 'cup_cakes', 'donuts', 'french_toast', 'macarons', 'pancakes', 'red_velvet_cake',
        'strawberry_shortcake', 'waffles'
    ],
    "Appetizer & Side Dishes": [
        'beet_salad', 'bruschetta', 'caesar_salad', 'caprese_salad', 'ceviche', 'deviled_eggs', 'edamame',
        'falafel', 'french_fries', 'fried_calamari', 'garlic_bread', 'greek_salad', 'grilled_cheese_sandwich',
        'hummus', 'nachos', 'onion_rings', 'poutine', 'samosa', 'seaweed_salad', 'spring_rolls'
    ],
    "Meat & Seafood": [
        'baby_back_ribs', 'beef_carpaccio', 'beef_tartare', 'chicken_wings', 'crab_cakes', 'escargots',
        'foie_gras', 'grilled_salmon', 'mussels', 'oysters', 'sashimi', 'scallops', 'shrimp_and_grits',
        'steak', 'sushi', 'tuna_tartare'
    ],
    "Dairy Products & Desserts": [
        'cheese_plate', 'cheesecake', 'chocolate_mousse', 'creme_brulee', 'frozen_yogurt', 'ice_cream',
        'panna_cotta', 'tiramisu'
    ],
    "Rice Grains & Noodles": [
        'fried_rice', 'gnocchi', 'ravioli', 'risotto', 'ramen'
    ],
    "Beverages": [],
    "Fruits & Vegetables": [],
    "Sauce Condiments and Seasonings": ['guacamole' ],
}

# Image classification endpoints
@app.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Classify a food image",
    description="Upload a food image (JPG/PNG) to classify it into one of 101 food categories and return its category."
)
async def predict_image(file: UploadFile = File(..., description="A food image in JPG/PNG format")):
    logger.info(f"Received image file: {file.filename}")
    
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        logger.warning(f"Invalid file extension: {ext}")
        raise HTTPException(status_code=400, detail="Only JPG/PNG files are allowed")

    # Validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        logger.warning(f"File size too large: {len(contents)} bytes")
        raise HTTPException(status_code=400, detail="File size exceeds 5MB")

    # Process image
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except UnidentifiedImageError:
        logger.error("Invalid image file")
        raise HTTPException(status_code=400, detail="Invalid image file")
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing image")

    # Predict
    try:
        # Create a temporary file using mkstemp
        fd, temp_file_path = tempfile.mkstemp(suffix=".jpg")
        try:
            image.save(temp_file_path)
            label, output_image_path = classifier.predict(temp_file_path)
        finally:
            os.close(fd)
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)  # Clean up
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    # Determine category
    category = next((cat for cat, foods in food_categories.items() if label in foods), "Uncategorized")

    # Encode output image as base64 if available
    output_image = None
    if output_image_path and os.path.exists(output_image_path):
        try:
            with open(output_image_path, "rb") as f:
                output_image = base64.b64encode(f.read()).decode("utf-8")
        except Exception as e:
            logger.warning(f"Failed to encode output image: {str(e)}")

    logger.info(f"Prediction for {file.filename}: {label} (Category: {category})")
    return PredictionResponse(label=label, category=category, output_image=output_image)

# E-commerce assistant endpoints
def execute_function_call(raw_response: str) -> str:
    think_end = raw_response.find('</think>')
    answer_section = raw_response[think_end + len('</think>'):].strip() if think_end != -1 else raw_response.strip()

    function_calls = []
    while '<function>' in answer_section:
        start_idx = answer_section.find('<function>') + len('<function>')
        end_idx = answer_section.find('</function>', start_idx) or len(answer_section)
        function_call = answer_section[start_idx:end_idx].strip()
        function_calls.append(function_call)
        answer_section = answer_section[end_idx + len('</function>'):]

    results = []
    for call in function_calls:
        try:
            tool_name, param_str = call.split(':', 1)
            params = json.loads(param_str.replace("'", '"').strip())
            tool = next(t for t in tools if t.name == tool_name.strip())
            result = tool.run(**params)
            results.append(f"{tool_name.strip()} result: {result}")
        except Exception as e:
            results.append(f"Error in {call[:24]}: {str(e)}")

    clean_answer = re.sub(r'<\/?function>', '', answer_section).strip()
    final_answer = clean_answer + ('\n\n' + '\n'.join(results) if results else '')
    return final_answer

@app.post(
    "/ask",
    response_model=QuestionResponse,
    summary="Ask the e-commerce assistant",
    description="Submit a question to the EcoHarvest assistant, which uses RAG and tools for feedback and calculations."
)
async def ask_question(request: QuestionRequest):
    session_id = request.session_id
    question = request.question
    logger.info(f"Received question for session {session_id}: {question}")

    try:
        if session_id not in session_store:
            session_store[session_id] = {
                "history": ChatMessageHistory(),
                "retriever": retriever
            }

        session = session_store[session_id]
        history = session["history"]
        last_messages = history.messages[-6:]

        # RAG processing
        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", "Rephrase questions considering chat history."),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}")
        ])
        
        history_aware_retriever = create_history_aware_retriever(
            llm, session["retriever"], contextualize_q_prompt
        )

        system_prompt = """You are Max, an e-commerce assistant. Strict rules:
        You only provide answers based on the context provided about ecoHarvest or carry out the following functions:
        **Available Functions:**
        1. calculate_math: 
        - Use for: Any mathematical calculations
        - Parameters: "expression": "mathematical expression as string"
        - Example: <function>calculate_math: {{"expression":"80*0.15"}} </function>

        2. get_customer_feedback:
        - Use for: Recording customer reviews/feedback
        - Parameters: "customerName": "string", "email": "string", "feedback": "string"
        - Example: <function>get_customer_feedback: {{"customerName":"[customer name]","email":"[email]","feedback":"[customer feedback]"}} </function>

        3. Function calls MUST:
        - Be wrapped in <function> tags
        - Use EXACT parameter names
        - Appear where their results should be used

        4. Never invent functions - only use the 2 listed above

        5. For ecoHarvest-related questions, use the context below:
        {context}"""

        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}")
        ])
        
        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

        # Get and process response
        result = rag_chain.invoke({
            "input": question,
            "chat_history": last_messages
        })
        final_answer = execute_function_call(result["answer"])

        # Update history
        history.add_user_message(question)
        history.add_ai_message(final_answer)

        logger.info(f"Response for session {session_id}: {final_answer[:100]}...")
        return QuestionResponse(answer=final_answer)

    except Exception as e:
        logger.error(f"Error processing question for session {session_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

# Food categorization endpoint
@app.get(
    "/food/categories",
    response_model=List[FoodCategory],
    summary="Get food categories",
    description="Returns a list of all food items and their respective categories."
)
async def get_food_categories():
    logger.info("Received request for food categories")
    
    # Create response list
    categorized_foods = []
    for label in class_name.values():
        category = next((cat for cat, foods in food_categories.items() if label in foods), "Uncategorized")
        categorized_foods.append(FoodCategory(label=label, category=category))

    logger.info(f"Returning {len(categorized_foods)} categorized food items")
    return categorized_foods

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the EcoHarvest Combined API",
        "endpoints": {
            "image_classification": "/predict",
            "ecommerce_assistant": "/ask",
            "food_categories": "/food/categories",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)