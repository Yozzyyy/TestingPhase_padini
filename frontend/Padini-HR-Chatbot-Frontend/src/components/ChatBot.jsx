import { useEffect, useRef } from "react";

export default function ChatBot({
  isChatOpen,
  setIsChatOpen,
  chatInput,
  setChatInput,
  messages,
  setMessages,
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  const getBotResponse = (input) => {
    const text = input.toLowerCase();
    if (
      text.includes("stock") ||
      text.includes("sku") ||
      text.includes("p-") ||
      text.includes("product")
    ) {
      return "SKU: P-20993 (Mens Slim Fit Polo). Stock: 8 (Store Floor), 45 (Regional Warehouse). Price: RM 79.00.";
    } else if (
      text.includes("discount") ||
      text.includes("member") ||
      text.includes("pmp")
    ) {
      return "PMP Member Discount is 10% on normal priced items. Remember to always verify the card ID against the active 'PMP Database' on the POS app.";
    } else if (text.includes("return") || text.includes("exchange")) {
      return "Exchanges must be completed within 14 days. Original receipts required and items must have original price tags attached.";
    } else {
      return "I've searched our internal SOP database but couldn't locate precise results. Please look up this subject in the main 'Knowledge Hub' dashboard on this page.";
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      sender: "staff",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const inputForBot = chatInput;
    setChatInput("");

    setTimeout(() => {
      const botResponse = {
        sender: "bot",
        text: getBotResponse(inputForBot),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  return (
    <>
      {isChatOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <div className="chat-header-identity">
              <img
                src="src/assets/Padini_Short.png"
                className="chat-logo"
                alt="Logo"
                width="300"
                height="300"
              />
              <div className="chat-header-text">
                <p className="chat-header-title">Staff Assistant</p>
                <p className="chat-header-subtitle">
                  Connected to Store Database
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="chat-close-btn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="chat-viewport">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.sender}`}>
                <span className="message-meta">
                  {msg.sender === "bot" ? "Bot" : "Alex"} â€¢ {msg.timestamp}
                </span>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-footer">
            <form onSubmit={handleSendMessage} className="chat-form">
              <input
                type="text"
                className="chat-form-input"
                placeholder="Enter SKU or ask policies..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="chat-send-btn">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        className="chat-trigger"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? (
          <svg
            className="chat-trigger-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            className="chat-trigger-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </>
  );
}
