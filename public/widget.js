(function () {
  // Find the script tag that loaded this widget
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf("widget.js") !== -1) {
          return scripts[i];
        }
      }
      return null;
    })();

  if (!currentScript) {
    console.error("[Chatfolio] Could not locate script tag.");
    return;
  }

  var botId = currentScript.getAttribute("data-bot-id");
  if (!botId) {
    console.error("[Chatfolio] Missing data-bot-id attribute on script tag.");
    return;
  }

  // Determine origin from the script src
  var scriptSrc = currentScript.src;
  var origin = new URL(scriptSrc).origin;

  // Unique CSS class prefix to avoid colliding with host site styles
  var PREFIX = "chatfolio-widget";

  // Inject scoped styles
  var style = document.createElement("style");
  style.textContent = [
    "." + PREFIX + "-button {",
    "  position: fixed;",
    "  bottom: 20px;",
    "  right: 20px;",
    "  width: 56px;",
    "  height: 56px;",
    "  border-radius: 50%;",
    "  background: #2563eb;",
    "  color: white;",
    "  border: none;",
    "  cursor: pointer;",
    "  box-shadow: 0 4px 12px rgba(0,0,0,0.15);",
    "  z-index: 2147483646;",
    "  display: flex;",
    "  align-items: center;",
    "  justify-content: center;",
    "  transition: transform 0.15s ease;",
    "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
    "}",
    "." + PREFIX + "-button:hover { transform: scale(1.05); }",
    "." + PREFIX + "-button svg { width: 24px; height: 24px; }",
    "." + PREFIX + "-frame {",
    "  position: fixed;",
    "  bottom: 90px;",
    "  right: 20px;",
    "  width: 380px;",
    "  height: 560px;",
    "  max-height: calc(100vh - 120px);",
    "  border: none;",
    "  border-radius: 16px;",
    "  box-shadow: 0 8px 32px rgba(0,0,0,0.18);",
    "  background: white;",
    "  z-index: 2147483647;",
    "  display: none;",
    "}",
    "." + PREFIX + "-frame.open { display: block; }",
    "@media (max-width: 480px) {",
    "  ." + PREFIX + "-frame {",
    "    width: calc(100vw - 20px);",
    "    height: calc(100vh - 100px);",
    "    right: 10px;",
    "    bottom: 80px;",
    "  }",
    "}",
  ].join("\n");
  document.head.appendChild(style);

  // Create the iframe
  var iframe = document.createElement("iframe");
  iframe.src = origin + "/embed/" + botId;
  iframe.className = PREFIX + "-frame";
  iframe.setAttribute("title", "Chat");
  document.body.appendChild(iframe);

  // Create the floating button
  var button = document.createElement("button");
  button.className = PREFIX + "-button";
  button.setAttribute("aria-label", "Open chat");
  button.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  document.body.appendChild(button);

  var isOpen = false;
  button.addEventListener("click", function () {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.classList.add("open");
      button.setAttribute("aria-label", "Close chat");
      button.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else {
      iframe.classList.remove("open");
      button.setAttribute("aria-label", "Open chat");
      button.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    }
  });
})();