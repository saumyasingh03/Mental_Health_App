from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline, Conversation, AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import torch.nn.functional as F

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"

face_model = None
face_processor = None
chat_pipeline = None

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    global face_model, face_processor

    try:
        if face_model is None:
            face_processor = AutoImageProcessor.from_pretrained("trpakov/vit-face-expression")
            face_model = AutoModelForImageClassification.from_pretrained("trpakov/vit-face-expression").to(device)

        image = Image.open(file.file).convert("RGB")
        inputs = {k: v.to(device) for k, v in face_processor(images=image, return_tensors="pt").items()}
        outputs = face_model(**inputs)
        
        logits = outputs.logits
        probs = F.softmax(logits, dim=-1)
        predicted_class = logits.argmax(-1).item()
        confidence = probs[0, predicted_class].item()
        caption = face_model.config.id2label[predicted_class]

        return {"caption": caption, "class_id": predicted_class, "confidence": confidence}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/chat")
async def chat(prompt: str = Form(...)):
    global chat_pipeline

    try:
        if chat_pipeline is None:
            chat_pipeline = pipeline(
                "conversational",
                model="facebook/blenderbot-400M-distill",
                device=0 if torch.cuda.is_available() else -1
            )

        reply = chat_pipeline(prompt)[0]['generated_text']
        return {"reply": reply}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/")
async def root():
    return {"message": "API is running successfully 🚀"}
