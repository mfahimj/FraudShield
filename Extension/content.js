chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "SHOW_WARNING") {
    showWarning(msg.risk);
  }
});

function showWarning(risk) {
  if (document.getElementById("fraudshield-overlay")) return;

  const div = document.createElement("div");
  div.id = "fraudshield-overlay";
  const riskPercentage = (risk * 100).toFixed(0);

  div.innerHTML = `
    <style>
      #fraudshield-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(15, 15, 18, 0.96) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 20px !important;
      }
      .fs-card {
        background: #1e1e24 !important;
        border: 1px solid rgba(231, 76, 60, 0.3) !important;
        border-top: 6px solid #e74c3c !important;
        padding: 40px 30px !important;
        border-radius: 16px !important;
        max-width: 480px !important;
        width: 100% !important;
        text-align: center !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5) !important;
      }
      .fs-icon {
        margin-bottom: 20px !important;
        animation: fs-pulse 2s infinite !important;
      }
      .fs-title {
        color: #ffffff !important;
        font-size: 26px !important;
        font-weight: 700 !important;
        margin: 0 0 10px 0 !important;
      }
      .fs-desc {
        color: #b3b3b3 !important;
        font-size: 15px !important;
        line-height: 1.5 !important;
        margin: 0 0 24px 0 !important;
      }
      .fs-badge {
        display: inline-block !important;
        background: rgba(231, 76, 60, 0.15) !important;
        color: #e74c3c !important;
        padding: 6px 14px !important;
        border-radius: 20px !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        margin-bottom: 30px !important;
        border: 1px solid rgba(231, 76, 60, 0.3) !important;
      }
      .fs-btn-container {
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
      }
      .fs-btn-back {
        background: #3498db !important;
        color: #ffffff !important;
        border: none !important;
        padding: 14px 28px !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        cursor: pointer !important;
        transition: background 0.2s ease !important;
      }
      .fs-btn-back:hover {
        background: #2980b9 !important;
      }
      .fs-btn-proceed {
        background: transparent !important;
        color: #888888 !important;
        border: none !important;
        padding: 8px !important;
        font-size: 13px !important;
        cursor: pointer !important;
        text-decoration: underline !important;
        transition: color 0.2s ease !important;
      }
      .fs-btn-proceed:hover {
        color: #e74c3c !important;
      }
      @keyframes fs-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    </style>

    <div class="fs-card">
      <div class="fs-icon">
        // <img src="${chrome.runtime.getURL('logo.png')}" width="80" height="80" alt="FraudShield Shield Logo">
      </div>
      
      <h1 class="fs-title">Deceptive Site Ahead</h1>
      <p class="fs-desc">FraudShield AI has flagged this link. It matches architectural structural signatures commonly used in credential harvesting and identity spoofing campaigns.</p>
      
      <div class="fs-badge">Threat Confidence: ${riskPercentage}%</div>
      
      <div class="fs-btn-container">
        <button id="fs-back" class="fs-btn-back">Take Me to Safety</button>
        <button id="fs-proceed" class="fs-btn-proceed">Understand risks, proceed anyway</button>
      </div>
    </div>
  `;

  document.body.appendChild(div);

  document.getElementById("fs-back").onclick = () => {
    window.history.back();
  };

  document.getElementById("fs-proceed").onclick = () => {
    div.remove();
    activateHighAlert();
  };
}

function activateHighAlert() {
  console.warn("🛡️ FraudShield: Smart Notification Lockdown Active.");

  // ==========================================
  // ⚙️ THE TOAST ENGINE (Replaces Irritating Alerts)
  // ==========================================
  // Injects a CSS styling framework for modern, non-blocking toast popups
  const toastStyle = document.createElement("style");
  toastStyle.innerHTML = `
    #fs-toast-container {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      z-index: 2147483647 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
      pointer-events: none !important;
    }
    .fs-toast {
      background: #1e1e24 !important;
      color: #ffffff !important;
      border-left: 5px solid #e74c3c !important;
      padding: 16px 20px !important;
      border-radius: 8px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 14px !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
      transform: translateX(120%) !important;
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
      pointer-events: auto !important;
      max-width: 320px !important;
    }
    .fs-toast.visible {
      transform: translateX(0) !important;
    }
    .fs-toast-title {
      color: #e74c3c !important;
      font-weight: 700 !important;
      margin-bottom: 4px !important;
      text-transform: uppercase !important;
      font-size: 11px !important;
      letter-spacing: 0.5px !important;
    }
  `;
  document.head.appendChild(toastStyle);

  // Create the container element if it doesn't exist
  let toastContainer = document.getElementById("fs-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "fs-toast-container";
    document.body.appendChild(toastContainer);
  }

  // Helper function to trigger elegant sliding notifications
  function triggerFraudShieldNotification(message) {
    const toast = document.createElement("div");
    toast.className = "fs-toast";
    toast.innerHTML = `
      <div class="fs-toast-title">FraudShield Commands</div>
      <div>${message}</div>
    `;
    toastContainer.appendChild(toast);

    // Trigger slide-in transition
    setTimeout(() => toast.classList.add("visible"), 50);

    // Automatically slide out and clean up after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Initial deployment message
  triggerFraudShieldNotification("LOCKDOWN DEPLOYED: Environmental security tracking is now operational.");


  // ==========================================
  // 1. SCREENSHOT & RECORDING DETECTION PROXY
  // ==========================================
  // Fires perfectly now without looping because toast notifications don't steal focus!
  window.addEventListener("blur", () => {
    triggerFraudShieldNotification("Potential screen capture or recording activity suspected via focus shift.");
  });

  window.addEventListener("beforeprint", () => {
    triggerFraudShieldNotification("Print engine capture vector intercepted and restricted.");
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
    }
  });


  // ==========================================
  // 2. FORM DE-WEAPONIZATION
  // ==========================================
  document.querySelectorAll("form").forEach((form) => {
    form.removeAttribute("action");
    form.removeAttribute("method");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      triggerFraudShieldNotification("Form transmission terminated. Data payload scrubbed completely.");
    }, true);
  });

  document.querySelectorAll("input, textarea, select").forEach((input) => {
    input.setAttribute("autocomplete", "off");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
  });


  // ==========================================
  // 3. PASSIVE INTERCEPTIONS
  // ==========================================
  document.addEventListener("paste", (e) => {
    e.preventDefault();
    triggerFraudShieldNotification("Clipboard pasting disabled to isolate credentials.");
  }, true);
}