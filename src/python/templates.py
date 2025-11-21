# templates.py
# -----------------------------------------------
# Enhanced templates for AutoML script generation
# Each section can be selectively activated via checkboxes
# -----------------------------------------------

# ======== 🧩 EDA Templates ========
EDA_TEMPLATES = {


    "show_head": "print('\\n🔹 Head of the dataset:'); print(df.head())",
    "show_shape": "print('\\n🔹 Shape of dataset:', df.shape)",
    "info": "print('\\n🔹 Info:'); print(df.info())",
    "describe": "print('\\n🔹 Summary statistics:'); print(df.describe())",
    "null_values": "print('\\n🔹 Missing values count:\\n', df.isnull().sum())",
    "nan_values": "print('\\n🔹 Not numerical values count:\\n', df.isnan().sum)",
    "correlation": "print('\\n🔹 Correlation matrix:\\n', df.corr())",
    "skewness_test": """
print('\\n🔹 Skewness for numerical features:')
print(df.skew(numeric_only=True))
"""
}




# ======== 🎨 Visualization Templates ========




VISUALIZATION_TEMPLATES = {
    "histograms": """
df.hist(figsize=(10,8))
plt.suptitle('Feature Distributions')
plt.show()
""",
    "heatmap": """
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap')
plt.show()
""",
    "boxplots": """
for col in df.select_dtypes(include='number').columns:
    plt.figure(figsize=(6,3))
    sns.boxplot(x=df[col])
    plt.title(f'Boxplot of {col}')
    plt.show()
""",
    "pairplot": """
sns.pairplot(df.sample(min(200, len(df))), diag_kind='kde')
plt.suptitle('Pairplot of Numerical Features')
plt.show()
"""
}


# ======== 🧹 Feature Engineering Templates ========

FEATURE_ANALYSIS_TEMPLATES = {

    "show_feature_types": """
print('\\n🔹 Feature type overview:')
num_cols = df.select_dtypes(include='number').columns.tolist()
cat_cols = df.select_dtypes(exclude='number').columns.tolist()
print(f'Numerical columns ({len(num_cols)}):', num_cols)
print(f'Categorical columns ({len(cat_cols)}):', cat_cols)
""",

    "detect_and_fix_object_numerics": """
print('\\n🔹 Detecting object columns with potential numeric data...')
trigger_words = ['number', 'num', 'salary', 'rate', 'prob', 'probability', 'power', 'score', 'amount', 'count', 'size']
object_cols = df.select_dtypes(include='object').columns

for col in object_cols:
    lower_col = col.lower()
    if any(word in lower_col for word in trigger_words):
        print(f'🔸 Column "{col}" seems numeric (trigger word match). Attempting conversion...')
        before_nulls = df[col].isnull().sum()
        df[col] = pd.to_numeric(df[col].astype(str).str.replace('[^0-9.-]', '', regex=True), errors='coerce')
        after_nulls = df[col].isnull().sum()
        print(f'   → Converted "{col}" to numeric. Nulls before: {before_nulls}, after: {after_nulls}')
    else:
        # Additional smart detection: if 90%+ of values are numeric-like
        numeric_like = df[col].astype(str).str.match(r'^-?\\d+(\\.\\d+)?$').mean()
        if numeric_like > 0.9:
            print(f'🔸 Column "{col}" mostly numeric ({numeric_like*100:.1f}%). Converting...')
            df[col] = pd.to_numeric(df[col].astype(str).str.replace('[^0-9.-]', '', regex=True), errors='coerce')

# Refresh type overview
num_cols = df.select_dtypes(include='number').columns.tolist()
cat_cols = df.select_dtypes(exclude='number').columns.tolist()
print(f'✅ Updated numerical columns ({len(num_cols)}):', num_cols)
print(f'✅ Updated categorical columns ({len(cat_cols)}):', cat_cols)
"""
}




# ======== 🧹 Data Cleaning Templates ========




CLEANING_TEMPLATES = {
    "drop_duplicates": "df = df.drop_duplicates()",
    "missing_strategy_mean": "df = df.fillna(df.mean())",
    "missing_strategy_median": "df = df.fillna(df.median())",
    "missing_strategy_mode": "df = df.fillna(df.mode().iloc[0])",
    "missing_strategy_drop": "df = df.dropna()",
    "outlier_detection_iqr": """
Q1 = df.quantile(0.25)
Q3 = df.quantile(0.75)
IQR = Q3 - Q1
mask = ~((df < (Q1 - 1.5 * IQR)) | (df > (Q3 + 1.5 * IQR))).any(axis=1)
df = df[mask]
print(f'🔹 Removed outliers using IQR. Remaining samples: {df.shape[0]}')
""",
    "outlier_detection_zscore": """
from scipy import stats
z = np.abs(stats.zscore(df.select_dtypes(include='number')))
df = df[(z < 3).all(axis=1)]
print(f'🔹 Removed outliers using Z-score. Remaining samples: {df.shape[0]}')
""",
    "fix_skewness_log": """
from scipy.stats import skew
num_cols = df.select_dtypes(include='number').columns
for col in num_cols:
    if abs(skew(df[col].dropna())) > 1:
        df[col] = np.log1p(df[col])
print('🔹 Log transformation applied to skewed features.')
"""
}




# ======== ⚙️ Preprocessing Templates ========

PREPROCESSING_TEMPLATES = {
    "StandardScaler": """
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
df[df.select_dtypes(include='number').columns] = scaler.fit_transform(df.select_dtypes(include='number'))
print('🔹 Standard scaling applied.')
""",
    "MinMaxScaler": """
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
df[df.select_dtypes(include='number').columns] = scaler.fit_transform(df.select_dtypes(include='number'))
print('🔹 MinMax scaling applied.')
""",
    "RobustScaler": """
from sklearn.preprocessing import RobustScaler
scaler = RobustScaler()
df[df.select_dtypes(include='number').columns] = scaler.fit_transform(df.select_dtypes(include='number'))
print('🔹 Robust scaling applied.')
""",
    "OneHotEncoder": """
from sklearn.preprocessing import OneHotEncoder
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
encoded = encoder.fit_transform(df.select_dtypes(include='object'))
encoded_df = pd.DataFrame(encoded, columns=encoder.get_feature_names_out(df.select_dtypes(include='object').columns))
df = pd.concat([df.select_dtypes(exclude='object').reset_index(drop=True), encoded_df.reset_index(drop=True)], axis=1)
print('🔹 One-hot encoding applied to categorical columns.')
""",
    "LabelEncoder": """
from sklearn.preprocessing import LabelEncoder
encoder = LabelEncoder()
for col in df.select_dtypes(include='object').columns:
    df[col] = encoder.fit_transform(df[col])
print('🔹 Label encoding applied.')
"""
}




# ======== 🤖 Model Templates ========

MODEL_TEMPLATES = {
    "RandomForestClassifier": """
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
X = df.drop(target, axis=1)
y = df[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier()
model.fit(X_train, y_train)
print('Accuracy:', model.score(X_test, y_test))
""",
    "LogisticRegression": """
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
X = df.drop(target, axis=1)
y = df[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
print('Accuracy:', model.score(X_test, y_test))
""",
    "DecisionTreeClassifier": """
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
X = df.drop(target, axis=1)
y = df[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = DecisionTreeClassifier()
model.fit(X_train, y_train)
print('Accuracy:', model.score(X_test, y_test))
""",
    "XGBoost": """
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
X = df.drop(target, axis=1)
y = df[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
model.fit(X_train, y_train)
print('Accuracy:', model.score(X_test, y_test))
"""
}



