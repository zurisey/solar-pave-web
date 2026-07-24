import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR
from sklearn.multioutput import MultiOutputRegressor
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '../data/dataset_laboratorium.csv')
MODEL_DIR = os.path.join(BASE_DIR, 'saved_models')
os.makedirs(MODEL_DIR, exist_ok=True)

def train_model():
    print("Memuat dataset...")
    df = pd.read_csv(DATA_PATH)
    
    X = df[['Silica_Glass', 'EVA_Polymer', 'Bitumen', 'Hydrated_Lime']]
    y = df[['Marshall_Stability', 'Flow', 'VIM', 'VFB', 'Stiffness_Modulus']]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler_X = StandardScaler()
    scaler_y = StandardScaler()
    
    X_train_scaled = scaler_X.fit_transform(X_train)
    y_train_scaled = scaler_y.fit_transform(y_train)
    
    svr_model = MultiOutputRegressor(SVR(kernel='rbf', C=1.0, epsilon=0.1))
    
    print("Melatih model SVR...")
    svr_model.fit(X_train_scaled, y_train_scaled)
    
    joblib.dump(svr_model, os.path.join(MODEL_DIR, 'svr_model.pkl'))
    joblib.dump(scaler_X, os.path.join(MODEL_DIR, 'scaler_X.pkl'))
    joblib.dump(scaler_y, os.path.join(MODEL_DIR, 'scaler_y.pkl'))
    
    print(f"Model berhasil disimpan di: {MODEL_DIR}")

if __name__ == "__main__":
    train_model()