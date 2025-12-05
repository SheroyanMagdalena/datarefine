# builder_upload.py
import pandas as pd
from importlib import import_module


def build_pipeline(user_json, file_path, file_type="csv", target=None, verbose=True):

    # Load user dataset
    if file_type == "csv":
        df = pd.read_csv(file_path)
    elif file_type in ["xls", "xlsx"]:
        df = pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file type")

    # Local variables for exec
    local_vars = {"df": df, "target": target, "pd": pd}

    for stage, templates in user_json.items():
        if verbose:
            print(f"\n=== Running stage: {stage} ===")
        for tpl_name in templates:
            module_path = f"templates.{stage}.{tpl_name}"
            module = import_module(module_path)
            code_var = getattr(module, tpl_name.upper())
            if verbose:
                print(f"Executing template: {tpl_name}")
            exec(code_var, {}, local_vars)

    return local_vars["df"]


# Example usage
if __name__ == "__main__":
    pipeline_json = {
        "eda": ["head", "summary_stats"],
        "cleaning": ["handle_missing"],
        "encoding": ["onehot"],
        "scaling": ["standard"],
        "modeling": ["random_forest"]
    }

    df_processed = build_pipeline(
        user_json=pipeline_json,
        file_path="uploaded_dataset.csv",
        target="target"
    )
    print(df_processed.head())
