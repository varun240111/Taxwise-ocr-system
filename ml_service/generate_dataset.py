import os
import numpy as np
import pandas as pd

np.random.seed(42)

os.makedirs("data", exist_ok=True)

N = 10000


def choose_best_80c_instrument(age, risk_appetite, has_girl_child):
    if has_girl_child:
        return "SSY"

    if age <= 35 and risk_appetite == 3:
        return "ELSS"

    if age <= 40 and risk_appetite == 2:
        return "ELSS"

    if age <= 45 and risk_appetite == 1:
        return "PPF"

    if age >= 50:
        return "NSC"

    if risk_appetite == 1:
        return "FD"

    return "PPF"


rows = []

for _ in range(N):
    # Profile fields
    salary = int(np.random.randint(300000, 3500001))
    age = int(np.random.randint(22, 59))
    city_type = int(np.random.choice([0, 1], p=[0.4, 0.6]))  # 0 non-metro, 1 metro
    risk_appetite = int(np.random.choice([1, 2, 3], p=[0.35, 0.4, 0.25]))
    years_to_retirement = 60 - age

    # Life event style fields
    parent_senior = int(np.random.choice([0, 1], p=[0.75, 0.25]))
    has_girl_child = int(np.random.choice([0, 1], p=[0.85, 0.15]))

    # Salary fields
    basic_salary = int(salary * np.random.uniform(0.35, 0.5))
    hra_received = int(basic_salary * np.random.uniform(0.3, 0.55))
    special_allowance = int(salary * np.random.uniform(0.08, 0.2))
    bonus = int(salary * np.random.uniform(0.0, 0.12))
    employer_pf = int(min(basic_salary * 0.12, 21600))

    # User tax inputs
    is_rented = int(np.random.choice([0, 1], p=[0.35, 0.65]))
    rent_paid = int(np.random.randint(5000, 45001) * 12) if is_rented else 0

    existing_80c = int(np.random.randint(0, 150001))
    existing_80d = int(np.random.randint(0, 75001 if parent_senior else 25001))
    existing_nps = int(np.random.randint(0, 50001))
    existing_80g = int(np.random.randint(0, 50001))

    has_home_loan = int(np.random.choice([0, 1], p=[0.75, 0.25]))
    home_loan_interest = int(np.random.randint(50000, 200001)) if has_home_loan else 0

    has_education_loan = int(np.random.choice([0, 1], p=[0.85, 0.15]))
    education_loan_interest = int(np.random.randint(10000, 120001)) if has_education_loan else 0

    # Gaps
    limit_80d = 75000 if parent_senior else 25000

    gap_80c = max(0, 150000 - existing_80c)
    gap_80d = max(0, limit_80d - existing_80d)
    gap_nps = max(0, 50000 - existing_nps)

    # Labels
    suggest_80c_topup = 1 if gap_80c > 0 else 0
    suggest_80d = 1 if gap_80d > 0 else 0
    suggest_nps = 1 if gap_nps > 0 else 0

    best_80c_instrument = choose_best_80c_instrument(
        age,
        risk_appetite,
        has_girl_child
    )

    # Simple regime label for ML training
    total_deduction_signal = (
        gap_80c
        + gap_80d
        + gap_nps
        + home_loan_interest
        + education_loan_interest
    )

    recommended_regime = 0 if total_deduction_signal > 120000 else 1
    # 0 = old regime, 1 = new regime

    rows.append({
        # Input features from user/profile/salary
        "salary": salary,
        "age": age,
        "city_type": city_type,
        "risk_appetite": risk_appetite,
        "years_to_retirement": years_to_retirement,

        "basic_salary": basic_salary,
        "hra_received": hra_received,
        "special_allowance": special_allowance,
        "bonus": bonus,
        "employer_pf": employer_pf,

        "is_rented": is_rented,
        "rent_paid": rent_paid,

        "existing_80C": existing_80c,
        "existing_80D": existing_80d,
        "existing_NPS": existing_nps,
        "existing_80G": existing_80g,

        "has_home_loan": has_home_loan,
        "home_loan_interest": home_loan_interest,

        "has_education_loan": has_education_loan,
        "education_loan_interest": education_loan_interest,

        "parent_senior": parent_senior,
        "has_girl_child": has_girl_child,

        # Derived useful features
        "gap_80C": gap_80c,
        "gap_80D": gap_80d,
        "gap_NPS": gap_nps,

        # Target labels
        "suggest_80C_topup": suggest_80c_topup,
        "suggest_80D": suggest_80d,
        "suggest_NPS": suggest_nps,
        "best_80C_instrument": best_80c_instrument,
        "recommended_regime": recommended_regime,
    })


df = pd.DataFrame(rows)

df.to_csv("data/taxwise_training_data.csv", index=False)

print("Dataset generated successfully")
print("Rows:", len(df))
print("Saved at: ml_service/data/taxwise_training_data.csv")
print(df.head())