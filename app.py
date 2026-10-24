from flask import Flask, request, jsonify
from flask_cors import CORS  # CRITICAL for Chrome Extensions
import joblib
import numpy as np
import re
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)  # Allows your Chrome Extension to talk to this local server without security blocks

# Make sure this matches the filename you saved your trained Random Forest model as
model = joblib.load("fraudshield_model.pkl")

# -------- FEATURE EXTRACTION (UCI 30-Feature Map) --------
def extract_features(url):
    parsed = urlparse(url)
    domain = parsed.netloc
    path = parsed.path
    
    # 1. having_IP_Address
    ip_pattern = r"^(http|https)://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
    having_IP_Address = -1 if re.match(ip_pattern, url) else 1
    
    # 2. URL_Length
    if len(url) < 54:
        URL_Length = 1
    elif 54 <= len(url) <= 75:
        URL_Length = 0
    else:
        URL_Length = -1
        
    # 3. Shortining_Service
    match_short = re.search(r'bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs', url)
    Shortining_Service = -1 if match_short else 1
    
    # 4. having_At_Symbol
    having_At_Symbol = -1 if "@" in url else 1
    
    # 5. double_slash_redirecting
    double_slash_redirecting = -1 if url.rfind("//") > 7 else 1
    
    # 6. Prefix_Suffix (Hyphens in domain)
    Prefix_Suffix = -1 if "-" in domain else 1
    
    # 7. having_Sub_Domain
    dot_count = domain.count(".")
    if dot_count <= 2:
        having_Sub_Domain = 1  # Legitimate (e.g., google.com or www.google.com)
    elif dot_count == 3:
        having_Sub_Domain = 0  # Suspicious
    else:
        having_Sub_Domain = -1 # Phishing
        
    # 8. SSLfinal_State (Basic Heuristic for local checking)
    SSLfinal_State = 1 if parsed.scheme == "https" else -1
    
    # 12. HTTPS_token (Using 'https' inside the domain part)
    HTTPS_token = -1 if "https" in domain else 1
    
    # 17. Submitting_to_email
    Submitting_to_email = -1 if "mailto:" in url or "mail()" in url else 1

    # External/HTML-based features are given neutral/safe defaults (1 or 0) 
    # to keep the Chrome Extension interface lighting-fast.
    Domain_registeration_length = 1   # 9
    Favicon = 1                      # 10
    port = 1                         # 11
    Request_URL = 1                  # 13
    URL_of_Anchor = 1                # 14
    Links_in_tags = 1                # 15
    SFH = 1                          # 16
    Abnormal_URL = 1                 # 17
    Redirect = 0                     # 19
    on_mouseover = 1                 # 20
    RightClick = 1                   # 21
    popUpWidnow = 1                  # 22
    Iframe = 1                       # 23
    age_of_domain = 1                # 24
    DNSRecord = 1                    # 25
    web_traffic = 0                  # 26
    Page_Rank = 0                    # 27
    Google_Index = 1                 # 28
    Links_pointing_to_page = 0       # 29
    Statistical_report = 1           # 30

    # Consolidate all 30 features in the precise sequence the UCI dataset mandates
    features = [
        having_IP_Address, URL_Length, Shortining_Service, having_At_Symbol,
        double_slash_redirecting, Prefix_Suffix, having_Sub_Domain, SSLfinal_State,
        Domain_registeration_length, Favicon, port, HTTPS_token, Request_URL,
        URL_of_Anchor, Links_in_tags, SFH, Submitting_to_email, Abnormal_URL,
        Redirect, on_mouseover, RightClick, popUpWidnow, Iframe, age_of_domain,
        DNSRecord, web_traffic, Page_Rank, Google_Index, Links_pointing_to_page,
        Statistical_report
    ]

    return np.array(features).reshape(1, -1)

# -------- API --------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        url = data.get("url")
        
        if not url:
            return jsonify({"error": "No URL provided"}), 400

        # Extract the upgraded 30-feature shape
        features = extract_features(url)

        # Predict using Random Forest
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        
        # In our clean pipeline script: 0 = Phishing, 1 = Safe
        # Probabilities layout: [prob_of_being_0, prob_of_being_1]
        phishing_probability = probabilities[0] 
        safe_probability = probabilities[1]

        return jsonify({
            "prediction": int(prediction),          # 0 for Phishing, 1 for Safe
            "is_phishing": bool(prediction == 0),   # Helper boolean for your JS frontend
            "phishing_prob": float(phishing_probability),
            "safe_prob": float(safe_probability)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)