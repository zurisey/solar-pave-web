# SOLAR-PAVE: Pengoptimal Desain Campuran Cerdas

## Deskripsi Keseluruhan Web

SOLAR-PAVE adalah platform berbasis web interaktif yang dirancang untuk membantu para peneliti, insinyur sipil, dan praktisi jalan raya dalam mengoptimalkan perumusan **Glassphalt Termodifikasi Polimer** (campuran aspal ramah lingkungan yang memanfaatkan limbah kaca silika dan polimer EVA). 

Website ini mengintegrasikan pemodelan kecerdasan buatan menggunakan **Support Vector Regression (SVR)** dengan antarmuka modern yang responsif untuk memprediksi performa mekanis perkerasan jalan secara real-time.

Halaman web ini tersusun atas beberapa bagian utama:
1. **Navigasi Utama (Navbar):** Berisi menu pintasan ke bagian Sumber Daya, Data Latih, serta tombol cepat untuk memulai simulasi.
2. **Bagian Hero:** Menampilkan ringkasan informasi proyek dan dilengkapi dengan komponen *carousel* interaktif yang menampilkan teknologi penyusun web secara dinamis dengan transisi halus.
3. **Dashboard Utama & Simulator SVR:** Bagian inti tempat pengguna dapat mengatur parameter material (Kaca Silika, Polimer EVA, Aspal/Bitumen, dan Kapur Padam) secara manual atau menggunakan fitur pencarian otomatis berbasis AI. Sistem akan langsung menghitung prediksi parameter Marshall (Stabilitas, Kelelehan, VIM, VFB, dan Kekakuan) serta merender grafik analisis kurva secara real-time menggunakan Chart.js.
4. **Sumber Daya Material (Materi 01):** Edukasi mengenai komponen pembentuk material seperti Kaca Silika, Polimer EVA, Aspal/Bitumen, dan Kapur Padam.
5. **Data Latih & Performa AI (Materi 02):** Penjelasan mengenai bagaimana model SVR dilatih menggunakan data empiris laboratorium, termasuk metrik akurasi performa model ($R^2$ score).

---

## Tech Stack

* **Backend & ML Engine:** Python, FastAPI, Scikit-Learn, NumPy, Pandas, Joblib
* **Frontend UI:** Tailwind CSS, HTML5, JavaScript (ES6) dengan transisi animasi halus (*fade & slide*)
* **Visualisasi Data:** Chart.js (Scatter Plot & SVR Trendline)
* **Deployment:** Render Cloud / Uvicorn

---

## Struktur Proyek

```text
solar-pave/
│
├── main.py                # Server FastAPI & endpoint API SVR
├── requirements.txt       # Daftar dependensi Python
├── README.md              # Dokumentasi proyek
├── .gitignore             # Konfigurasi pengecualian file Git
└── static/                # Aset frontend (HTML, JS, CSS jika dipisah)