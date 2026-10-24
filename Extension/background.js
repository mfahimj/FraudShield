console.log("FraudShield Service Worker running...");

const trustedSites = [
  "google.com",
  "youtube.com",
  "github.com",
  "openai.com"
];

// 🛠️ NEW HELPER: Injects a native browser alert dialogue directly into the active webpage context
function triggerPageAlert(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (msg) => { alert(msg); },
    args: [message]
  }).catch((err) => console.error("Alert injection failed:", err.message));
}

// Helper: Safely sends messages to content scripts
async function safelySendMessage(tabId, message) {
  try {
    await chrome.tabs.sendMessage(tabId, message);
  } catch (err) {
    // Content script might not be injected yet
  }
}

// Helper: Updates the toolbar badge UI
function updateExtensionBadge(tabId, status, text) {
  if (status === "SAFE") {
    chrome.action.setBadgeText({ tabId: tabId, text: text });
    chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: "#2ecc71" });
  } else if (status === "RISK") {
    chrome.action.setBadgeText({ tabId: tabId, text: text });
    chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: "#e74c3c" });
  } else {
    chrome.action.setBadgeText({ tabId: tabId, text: "" });
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {

    if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) return;

    const urlObj = new URL(tab.url);
    const hostname = urlObj.hostname;

    // Heuristic 1: Immediate red flag for unencrypted HTTP connections
    if (urlObj.protocol !== "https:") {
      updateExtensionBadge(tabId, "RISK", "HTTP");

      const httpThreatData = { is_phishing: true, phishing_prob: 0.70, safe_prob: 0.30 };
      await chrome.storage.local.set({ [hostname]: httpThreatData });

      await safelySendMessage(tabId, { action: "SHOW_WARNING", risk: 0.7 });
      return;
    }

    // Heuristic 2: Pass known global trusted domains immediately
    if (trustedSites.some(site => hostname.includes(site))) {
      updateExtensionBadge(tabId, "SAFE", "OK");

      const safeData = { is_phishing: false, phishing_prob: 0.0, safe_prob: 1.0 };
      await chrome.storage.local.set({ [hostname]: safeData });

      return;
    }

    // Ping the Random Forest Backend
    try {
      updateExtensionBadge(tabId, "SCAN", "...");

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tab.url })
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();

      // Save to persistent storage
      await chrome.storage.local.set({ [hostname]: data });

      if (data.is_phishing && data.phishing_prob > 0.75) {
        updateExtensionBadge(tabId, "RISK", "⚠️");

        // 🚨 ALERT DIALOG TRIGGER
        triggerPageAlert(tabId, `FraudShield commands: WARNING! Phishing footprint detected on ${hostname}. Threat Confidence: ${(data.phishing_prob * 100).toFixed(0)}%`);

        await safelySendMessage(tabId, { action: "SHOW_WARNING", risk: data.phishing_prob });
      } else {
        updateExtensionBadge(tabId, "SAFE", "OK");

        // 🍏 ALERT DIALOG TRIGGER
        triggerPageAlert(tabId, `FraudShield commands: ${hostname} passed Random Forest structural screening.`);
      }

    } catch (err) {
      console.error("FraudShield Backend Error:", err.message);
      updateExtensionBadge(tabId, "ERR", "ERR");
      triggerPageAlert(tabId, "FraudShield commands: Critical connection error reaching the AI backend server.");
    }
  }
});