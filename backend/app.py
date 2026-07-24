from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Path import sudah diperbaiki di sini:
from backend.ml_model.predict import predict_mix

app = FastAPI(title="SOLAR-PAVE API")

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MixInput(BaseModel):
    silica_glass: float
    eva_polymer: float
    bitumen: float
    hydrated_lime: float

# 1. Endpoint API (HARUS didefinisikan sebelum StaticFiles)
@app.post("/api/predict")
async def get_prediction(data: MixInput):
    result = predict_mix(data.silica_glass, data.eva_polymer, data.bitumen, data.hydrated_lime)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

# 2. Konfigurasi Monolith: Melayani Frontend HTML/JS/CSS
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend", "public")

# Menjalankan frontend di root URL ("/")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="public")