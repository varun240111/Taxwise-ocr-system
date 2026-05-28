import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import accuracy_score, classification_report

os.makedirs("model", exist_ok=True)

DATA_PATH = "data/taxwise_training_data.csv"

df = pd.read_csv(DATA_PATH)

feature_columns = [
    "salary",
    "age",
    "city_type",
    "risk_appetite",
    "years_to_retirement",
    "basic_salary",
    "hra_received",
    "special_allowance",
    "bonus",
    "employer_pf",
    "is_rented",
    "rent_paid",
    "existing_80C",
    "existing_80D",
    "existing_NPS",
    "existing_80G",
    "has_home_loan",
    "home_loan_interest",
    "has_education_loan",
    "education_loan_interest",
    "parent_senior",
    "has_girl_child",
    "gap_80C",
    "gap_80D",
    "gap_NPS",
]

target_columns = [
    "suggest_80C_topup",
    "suggest_80D",
    "suggest_NPS",
    "best_80C_instrument",
    "recommended_regime",
]

X = df[feature_columns].copy()
Y = df[target_columns].copy()

instrument_encoder = LabelEncoder()
Y["best_80C_instrument"] = instrument_encoder.fit_transform(
    Y["best_80C_instrument"]
)

X_train, X_test, Y_train, Y_test = train_test_split(
    X,
    Y,
    test_size=0.2,
    random_state=42,
)

base_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=16,
    min_samples_leaf=4,
    random_state=42,
    class_weight="balanced",
)

model = MultiOutputClassifier(base_model)

model.fit(X_train, Y_train)

Y_pred = model.predict(X_test)

print("\nModel Training Completed\n")

for index, column in enumerate(target_columns):
    acc = accuracy_score(Y_test[column], Y_pred[:, index])
    print(f"{column} Accuracy: {acc:.4f}")

    print(
        classification_report(
            Y_test[column],
            Y_pred[:, index],
            zero_division=0,
        )
    )

joblib.dump(model, "model/taxwise_model.pkl")
joblib.dump(instrument_encoder, "model/instrument_encoder.pkl")
joblib.dump(feature_columns, "model/feature_columns.pkl")

print("\nModel saved successfully")
print("Saved files:")
print("model/taxwise_model.pkl")
print("model/instrument_encoder.pkl")
print("model/feature_columns.pkl")