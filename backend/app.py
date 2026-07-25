import os
import sys
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# ---------------------------------------------------------
# 1. PATH FIX: Mencegah ModuleNotFoundError
# ---------------------------------------------------------
# Mendapatkan path root folder (solar-pave-web) secara otomatis
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Menambahkan root folder ke system path agar modul 'backend' dikenali
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Sekarang import ini akan selalu berhasil meski di-run dari folder mana saja
from backend.ml_model.predict import predict_mix

# ---------------------------------------------------------
# 2. INISIALISASI APLIKASI
# ---------------------------------------------------------
app = FastAPI(title="SOLAR-PAVE API")

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

# ---------------------------------------------------------
# 3. ENDPOINT API (HARUS DI ATAS STATIC FILES)
# ---------------------------------------------------------
@app.post("/api/predict")
async def get_prediction(data: MixInput):
    try:
        # Menjalankan fungsi prediksi
        result = predict_mix(data.silica_glass, data.eva_polymer, data.bitumen, data.hydrated_lime)
        
        # Penanganan error jika fungsi mengembalikan pesan error
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result
    except Exception as e:
        # Menangkap error tak terduga agar server tidak crash
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# ---------------------------------------------------------
# 4. MOUNT FRONTEND (MONOLITH)
# ---------------------------------------------------------
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend", "public")

# Pengecekan folder untuk memastikan path frontend benar
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="public")
else:
    print(f"[WARNING] Folder frontend tidak ditemukan di: {FRONTEND_DIR}")

# ---------------------------------------------------------
# 5. ENTRY POINT (AGAR BISA DI-RUN LANGSUNG)
# ---------------------------------------------------------
if __name__ == "__main__":
    print("🚀 Memulai Server SOLAR-PAVE...")
    # Menjalankan server menggunakan Uvicorn secara programatik
    uvicorn.run("backend.app:app", host="127.0.0.1", port=8000, reload=True)
    
    import random

# --- (Kode Anda sebelumnya ada di atas sini) ---

# ENDPOINT BARU: Algoritma Pencarian Otomatis (True Optimization)
@app.get("/api/optimize-mix")
async def auto_optimize_mix():
    best_score = -9999
    best_mix = {}
    best_pred = {}
    
    try:
        # Melakukan 1000 iterasi percobaan virtual secara instan
        for _ in range(1000):
            # Mengacak resep sesuai batasan slider di web
            sg = round(random.uniform(0, 20), 1)
            eva = round(random.uniform(0, 10), 1)
            bit = round(random.uniform(4.0, 7.0), 1)
            lime = round(random.uniform(1.0, 3.0), 1)
            
            # Prediksi resep acak ini menggunakan model SVR Anda
            pred = predict_mix(sg, eva, bit, lime)
            if "error" in pred:
                continue
            
            # AMBIL NILAI (asumsi output predict_mix adalah dict, sesuaikan key-nya jika berbeda)
            # Misalnya mengembalikan: {"stability": 11.5, "vim": 4.5, "flow": 3.0, ...}
            stability = float(pred.get("stability", 0))
            vim = float(pred.get("vim", 0))
            
            # LOGIKA OPTIMASI: Cari stabilitas setinggi-tingginya
            score = stability
            
            # Berikan penalti/hukuman jika VIM di luar standar ideal Bina Marga (misal 3% - 5%)
            if vim < 3.0:
                score -= (3.0 - vim) * 50  # Penalti berat
            elif vim > 5.0:
                score -= (vim - 5.0) * 50  # Penalti berat
                
            # Simpan resep jika skornya memecahkan rekor tertinggi
            if score > best_score:
                best_score = score
                best_mix = {
                    "silica_glass": sg,
                    "eva_polymer": eva,
                    "bitumen": bit,
                    "hydrated_lime": lime
                }
                best_pred = pred
                
        return {
            "recommended_mix": best_mix,
            "predictions": best_pred
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal melakukan optimasi: {str(e)}")

# --- (Kode app.mount("/", StaticFiles...) ada di bawah sini) ---