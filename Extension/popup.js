document.addEventListener("DOMContentLoaded", async () => {
  const urlLabel = document.getElementById("site-url");
  const riskCard = document.getElementById("risk-card-element");
  const badge = document.getElementById("badge-element");
  const score = document.getElementById("score-element");
  const verdictLabel = document.getElementById("verdict-label");
  const indicatorsBox = document.getElementById("indicators-box");

  // 1. Identify the active browser tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url) {
    urlLabel.textContent = "Unknown Context";
    return;
  }

  const urlObj = new URL(tab.url);
  const hostname = urlObj.hostname;
  urlLabel.textContent = hostname;

  // Handle internal Chrome system management tabs safely
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) {
    updateUI(0, "SYSTEM SAFE", false, [
      "<span style='color: #2ecc71'>✓ Internal Core Framework Environment</span>",
      "<span style='color: #2ecc71'>✓ High-Privilege Process Isolated</span>"
    ]);
    return;
  }

  // 2. 🚀 Read directly from persistent storage
  chrome.storage.local.get([hostname], (result) => {
    const aiData = result[hostname];

    // Fallback if the database entry hasn't finished writing yet
    if (!aiData) {
      badge.textContent = "SCANNING...";
      score.textContent = "--";
      verdictLabel.textContent = "Waiting for server sync...";
      indicatorsBox.innerHTML = `<li>⏳ Analyzing structural footprints... Re-open this panel in a second.</li>`;
      return;
    }

    const isHTTPS = urlObj.protocol === "https:";

    // Generate visual diagnostics strings
    let diagnostics = [];
    if (isHTTPS) diagnostics.push("<span style='color: #2ecc71'>✓ SSL Layer Active (HTTPS)</span>");
    else diagnostics.push("<span style='color: #e74c3c'>❌ Unencrypted Connection (HTTP)</span>");

    if (hostname.includes("-")) diagnostics.push("<span style='color: #e74c3c'>❌ Suspicious Hyphens in Domain</span>");
    else diagnostics.push("<span style='color: #2ecc71'>✓ Balanced Domain Structure</span>");

    if ((hostname.match(/\./g) || []).length > 2) {
      diagnostics.push("<span style='color: #e74c3c'>❌ Deep Subdomain Layering</span>");
    }

    // 3. Render the output matching the stored Random Forest verdict
    if (aiData.is_phishing) {
      updateUI(aiData.phishing_prob, "HIGH RISK", true, diagnostics);
    } else {
      updateUI(aiData.safe_prob, "VERIFIED SAFE", false, diagnostics);
    }
  });

  // Helper function to dynamically alter the popup theme
  function updateUI(probability, statusText, isPhishing, indicators) {
    score.textContent = (probability * 100).toFixed(0);
    badge.textContent = statusText;

    if (isPhishing) {
      riskCard.classList.add("threat-mode");
      verdictLabel.textContent = "Malicious Probability Profile";
    } else {
      riskCard.classList.remove("threat-mode");
      verdictLabel.textContent = "Threat Probability Score";
    }

    // Build the visual indicators list items cleanly
    indicatorsBox.innerHTML = indicators.map(item => `<li>${item}</li>`).join("");
  }

  // Action Buttons wiring
  document.getElementById("scan-btn").addEventListener("click", () => {
    chrome.storage.local.clear(() => {
      alert("FraudShield storage cache cleared successfully.");
      window.close();
    });
  });

  document.getElementById("settings-btn").addEventListener("click", () => {
    alert("FraudShield v2.0 - Powered by Scikit-Learn Random Forest Pipeline.");
  });
});