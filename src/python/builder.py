import templates
import json

def build_pipeline(user_input, output_file="generated_pipeline.py"):
    """
    user_input: dict from frontend
    output_file: path to save generated Python script
    """
    code_sections = []

    # 0️⃣ Imports (basic imports for any pipeline)
    imports = """
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
"""
    code_sections.append(imports)

    # 1️⃣ Feature analysis (if selected)
    feature_input = user_input.get("FeatureAnalysis", {})
    if feature_input.get("show_feature_types"):
        code_sections.append(templates.FEATURE_ANALYSIS_TEMPLATES["show_feature_types"])
    if feature_input.get("type_correction"):
        code_sections.append(templates.FEATURE_ANALYSIS_TEMPLATES["detect_and_fix_object_numerics"])

    # 2️⃣ EDA
    for key, value in user_input.get("EDA", {}).items():
        if value and key in templates.EDA_TEMPLATES:
            code_sections.append(templates.EDA_TEMPLATES[key])

    # 3️⃣ Visualization
    for key, value in user_input.get("Visualization", {}).items():
        if value and key in templates.VISUALIZATION_TEMPLATES:
            code_sections.append(templates.VISUALIZATION_TEMPLATES[key])

    # 4️⃣ Data cleaning
    cleaning_input = user_input.get("DataCleaning", {})
    for key, value in cleaning_input.items():
        if key == "missing_strategy":
            code_sections.append(templates.CLEANING_TEMPLATES[f"missing_strategy_{value}"])
        elif value and key in templates.CLEANING_TEMPLATES:
            code_sections.append(templates.CLEANING_TEMPLATES[key])

    # 5️⃣ Target variable extraction
    model_input = user_input.get("Model", {})
    target_col = model_input.get("target")
    if target_col:
        code_sections.append(f"""
    # Extract target and features
    y = df['{target_col}']
    X = df.drop(columns=['{target_col}'])
    print('Target column: {target_col}')
    print('Feature columns:', X.columns.tolist())
    """)
    else:
        code_sections.append("""
    # No target specified
    print('Warning: No target column specified. Skipping model training.')
    """)

    # 6️⃣ Preprocessing
    preprocessing_input = user_input.get("Preprocessing", {})
    for step in preprocessing_input.values():
        if step in templates.PREPROCESSING_TEMPLATES:
            code_sections.append(templates.PREPROCESSING_TEMPLATES[step])

    # 7️⃣ Model
    model_name = model_input.get("algorithm")
    if model_name and target_col and model_name in templates.MODEL_TEMPLATES:
        code_sections.append(templates.MODEL_TEMPLATES[model_name])

    # Combine all sections
    final_code = "\n\n".join(code_sections)

    # Write to file
    with open(output_file, "w") as f:
        f.write(final_code)

    print(f"Pipeline successfully generated in {output_file}")


