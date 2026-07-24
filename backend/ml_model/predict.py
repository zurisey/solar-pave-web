import joblib
import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'saved_models')

def predict_mix(silica, eva, bitumen, lime):
    try:
        model = joblib.load(os.path.join(MODEL_DIR, 'svr_model.pkl'))
        scaler_X = joblib.load(os.path.join(MODEL_DIR, 'scaler_X.pkl'))
        scaler_y = joblib.load(os.path.join(MODEL_DIR, 'scaler_y.pkl'))

        input_df = pd.DataFrame({'Silica_Glass': [silica], 'EVA_Polymer': [eva], 'Bitumen': [bitumen], 'Hydrated_Lime': [lime]})
        input_scaled = scaler_X.transform(input_df)
        pred_scaled = model.predict(input_scaled)
        pred = scaler_y.inverse_transform(pred_scaled)

        return {
            "Marshall_Stability": round(float(pred[0][0]), 1),
            "Flow": round(float(pred[0][1]), 1),
            "VIM": round(float(pred[0][2]), 1),
            "VFB": round(float(pred[0][3]), 1),
            "Stiffness_Modulus": int(pred[0][4])
        }
    except Exception as e:
        return {"error": str(e)}