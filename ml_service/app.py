from flask import Flask, request, jsonify
from flask_cors import CORS
import os

import pandas as pd
import joblib

app = Flask(__name__)

CORS(app)

# LOAD MODEL FILES
model = joblib.load("model/taxwise_model.pkl")

instrument_encoder = joblib.load(
    "model/instrument_encoder.pkl"
)

feature_columns = joblib.load(
    "model/feature_columns.pkl"
)


# HOME ROUTE
@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "TaxWise ML Service is running"
    })


# PREDICTION ROUTE
@app.route("/predict-tax-plan", methods=["POST"])
def predict_tax_plan():

    try:

        data = request.json

        input_data = {
            "salary": data.get("salary", 0),
            "age": data.get("age", 0),
            "city_type": data.get("city_type", 0),
            "risk_appetite": data.get("risk_appetite", 1),
            "years_to_retirement": data.get("years_to_retirement", 0),

            "basic_salary": data.get("basic_salary", 0),
            "hra_received": data.get("hra_received", 0),
            "special_allowance": data.get("special_allowance", 0),
            "bonus": data.get("bonus", 0),
            "employer_pf": data.get("employer_pf", 0),

            "is_rented": data.get("is_rented", 0),
            "rent_paid": data.get("rent_paid", 0),

            "existing_80C": data.get("existing_80C", 0),
            "existing_80D": data.get("existing_80D", 0),
            "existing_NPS": data.get("existing_NPS", 0),
            "existing_80G": data.get("existing_80G", 0),

            "has_home_loan": data.get("has_home_loan", 0),
            "home_loan_interest": data.get("home_loan_interest", 0),

            "has_education_loan": data.get("has_education_loan", 0),
            "education_loan_interest": data.get("education_loan_interest", 0),

            "parent_senior": data.get("parent_senior", 0),
            "has_girl_child": data.get("has_girl_child", 0),

            "gap_80C": data.get("gap_80C", 0),
            "gap_80D": data.get("gap_80D", 0),
            "gap_NPS": data.get("gap_NPS", 0),
        }

        df = pd.DataFrame([input_data])

        prediction = model.predict(df)[0]

        best_instrument = (
            instrument_encoder.inverse_transform(
                [prediction[3]]
            )[0]
        )

        response = {
            "suggest_80C_topup":
                int(prediction[0]),

            "suggest_80D":
                int(prediction[1]),

            "suggest_NPS":
                int(prediction[2]),

            "best_80C_instrument":
                best_instrument,

            "recommended_regime":
                "Old Regime"
                if prediction[4] == 0
                else "New Regime",
        }

        return jsonify({
            "success": True,
            "prediction": response,
        })

    except Exception as error:

        return jsonify({
            "success": False,
            "message": str(error),
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5001)),
        debug=False
    )

    