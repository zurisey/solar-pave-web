# SOLAR-PAVE Intelligent Mix Design Optimizer

Web aplikasi berbasis Machine Learning (Support Vector Regression) untuk mengoptimalkan komposisi material *Polymer-Modified Glassphalt*.

## Struktur Proyek
- `backend/`: Logika Python (FastAPI & Scikit-Learn)
- `frontend/`: Tampilan antarmuka pengguna (HTML, JS, Tailwind CSS)

## Cara Menjalankan Secara Lokal
1. Buat virtual environment: `python -m venv .venv`
2. Aktifkan venv: `source .venv/Scripts/activate` (Windows)
3. Instal pustaka: `pip install -r requirements.txt`
4. Latih model SVR: `python backend/ml_model/train_svr.py`
5. Jalankan server: `uvicorn backend.app:app --reload`
6. Buka web di browser: `http://127.0.0.1:8000`

## Deployment di Render.com
Proyek ini dikonfigurasi sebagai aplikasi *monolith* di mana FastAPI melayani endpoint API dan file statis (Frontend) secara bersamaan.
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`