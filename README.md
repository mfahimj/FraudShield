# 🛡️ FraudShield
### AI-Powered Phishing and Financial Fraud Detection

FraudShield is a browser security project designed to help users identify suspicious websites and reduce the risk of phishing attacks and online financial fraud. It combines a Machine Learning model, a Python backend, and a browser extension to analyze websites and warn users when a site appears risky.

The goal is to make online browsing safer, especially when users access banking websites, payment portals, and other sensitive services.

## ✨ Features

- **🔍 Website Risk Detection:** Analyzes website URLs to identify potentially suspicious websites.
- **🤖 Machine Learning:** Uses a Random Forest classifier trained on a phishing website dataset.
- **🌐 Real-Time Browser Monitoring:** Checks websites as users visit them through the browser extension.
- **🔒 HTTPS Filter:** Identifies websites that use HTTP instead of HTTPS as a potential security concern.
- **⚠️ Risk Warnings:** Displays a warning when a website is classified as suspicious.
- **🚨 High Alert Mode:** Provides an additional warning experience when a user chooses to proceed to a suspicious website.
- **🧠 Hybrid Detection:** Combines machine learning predictions with basic URL-based security checks.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend development and model integration |
| Scikit-learn | Machine Learning and Random Forest classifier |
| Pandas & NumPy | Dataset processing and feature preparation |
| Flask | Backend API |
| JavaScript | Browser extension logic |
| HTML & CSS | Warning interface and user interaction |
| Chrome Extensions API | Browser monitoring and communication |
| Google Colab | Model training and evaluation |
| Git & GitHub | Version control and collaboration |

## ⚙️ How It Works

1. **Website Visit:** The user opens a website in their browser.
2. **URL Analysis:** The browser extension sends the website URL to the FraudShield backend.
3. **Feature Extraction:** The backend extracts URL features that match the features used during model training.
4. **ML Prediction:** The trained Random Forest model predicts whether the website is likely to be phishing or legitimate.
5. **Security Checks:** The system applies additional checks, including HTTPS status and configured URL-based rules.
6. **Warning:** If the website meets the configured risk conditions, FraudShield displays a warning to the user.

```text
User Visits a Website
         |
         v
Browser Extension
         |
         v
Flask Backend API
         |
         v
URL Feature Extraction
         |
         v
Random Forest Model
         |
         v
Risk Assessment
         |
         v
Safe Result / Security Warning
```

## Dataset

FraudShield uses the **Phishing Websites dataset** from the UCI Machine Learning Repository.

- **Dataset ID:** 327
- **Instances:** 11,055
- **Features:** 30
- **Task:** Classification of phishing and legitimate websites
- **Source:** [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/327/phishing)
- **License:** CC BY 4.0

**Citation:** Mohammad, R., Thabtah, F., & McCluskey, L. *Phishing Websites*. UCI Machine Learning Repository. https://doi.org/10.24432/C51W2X.

## 🧠 Machine Learning Model

FraudShield uses a Random Forest classification model trained using a phishing website dataset.

The model training process includes:

- Loading and cleaning the dataset.
- Separating website features from the target label.
- Splitting the data into training and testing sets.
- Training the Random Forest classifier.
- Evaluating the model using accuracy, precision, recall, and F1-score.
- Saving the trained model for use by the Flask backend.

The model achieved approximately **97.42% accuracy** on the reported test split during development. This is an experimental result and does not guarantee the same performance on new, real-world websites.

**Important:** The features and their order during prediction must exactly match those used to train the model.

## 📁 Project Structure

```text
FraudShield/
│
├── app.py                  # Flask backend and prediction API
├── fraudshield_model.pkl   # Trained ML model
├── manifest.json           # Browser extension configuration
├── background.js            # Background URL monitoring
├── content.js               # Warning interface and interactions
├── README.md                # Project documentation
└── requirements.txt         # Python dependencies
```

*The structure may vary depending on your final implementation.*

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or a compatible version
- Google Chrome or a compatible Chromium-based browser
- Git
- A trained FraudShield model file

### 1. Clone the Repository

```bash
git clone https://github.com/mfahimj/FraudShield.git
```

Move into the project directory:

```bash
cd FraudShield
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Install Dependencies

Create a virtual environment (recommended):

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install flask flask-cors scikit-learn pandas numpy joblib
```

Use compatible package versions for the environment in which the model was trained.

### 3. Start the Backend

Ensure `fraudshield_model.pkl` is present in the project directory.

Run:

```bash
python app.py
```

The Flask backend should start locally, typically at:

```text
http://127.0.0.1:5000
```

### 4. Load the Browser Extension

1. Open Chrome.
2. Visit `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project folder containing `manifest.json`.
6. Ensure the backend is running before testing the extension.

### 5. Test FraudShield

Visit a selection of known legitimate and known phishing test URLs in a controlled environment. Check the browser extension console and backend terminal for prediction results and errors.

**Safety tip:** Do not enter real passwords, banking credentials, or OTPs on suspicious websites during testing.

## 📊 Model Evaluation

FraudShield evaluates the model using standard classification metrics:

- **Accuracy:** Percentage of correct predictions.
- **Precision:** How often phishing predictions are correct.
- **Recall:** How many phishing examples the model successfully detects.
- **F1-score:** Balance between precision and recall.

High accuracy alone is not enough. False positives and false negatives must also be tested using data that was not used during training.

## 🔐 Security and Limitations

FraudShield is an academic prototype intended for learning, experimentation, and demonstration.

- HTTPS does not guarantee that a website is legitimate. Phishing websites can also use HTTPS.
- URL-based features alone cannot reliably detect every phishing attack.
- A model's test accuracy does not guarantee real-world detection accuracy.
- The prototype's High Alert Mode should not be assumed to lock banking apps, encrypt files, disable screenshots, or control operating-system permissions unless those capabilities are separately implemented and tested.
- The extension and backend should be secured before any public deployment.
- The current local backend is intended for development and testing, not production use.

FraudShield should be used as an additional layer of protection, not as a replacement for a browser's built-in security features or professional security software.

## 🔮 Future Improvements

- Integrate a website reputation service such as Google Safe Browsing.
- Improve detection using additional URL, domain, and website signals.
- Test against independent phishing datasets and recently reported threats.
- Reduce false positives through feature engineering and model evaluation.
- Improve the warning dashboard and display understandable risk explanations.
- Add a secure, privacy-conscious High Alert Mode.
- Explore AMD hardware acceleration where compatible hardware and supported software are available.

## 👥 Team

Developed as a collaborative student project focused on cybersecurity, machine learning, and financial fraud prevention.

**Project:** FraudShield  
**Domain:** Cybersecurity and Financial Fraud Detection  
**Project Type:** Academic / Hackathon Prototype

## 📜 Disclaimer

FraudShield is provided for educational and research purposes. Its predictions may be incorrect, and the project does not guarantee protection against phishing, financial fraud, or other cyber threats. Always verify website addresses and use trusted security practices.

## 📚 Acknowledgements

- [Grega Vrbancic's Phishing Dataset](https://github.com/GregaVrbancic/Phishing-Dataset)
- [Scikit-learn](https://scikit-learn.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Google Colab](https://colab.research.google.com/)
