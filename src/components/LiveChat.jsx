import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

export default function LiveChat() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! My name is Mr. Daily Hustler. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const palette = {
    bg: isDark ? '#121212' : '#f8f9fa',
    cardBg: isDark ? '#1c1c1e' : '#fff',
    text: isDark ? '#f7f7fa' : '#212529',
    label: isDark ? '#adb5bd' : '#6c757d',
    border: isDark ? '#313843' : '#dee2e6',
    red: '#e53e3e',
    input: isDark ? '#1c1c1e' : '#fff',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('campaign') || message.includes('create')) {
      return "I can help you create campaigns! Go to 'Create New Campaign' from the sidebar, select a campaign type, and fill in your details. Need specific help with any step?";
    } else if (message.includes('payment') || message.includes('fund') || message.includes('wallet')) {
      return "For payments and funding, visit your Wallet page. You can add funds using various payment methods. The platform fee is 15% on top of your campaign budget.";
    } else if (message.includes('worker') || message.includes('submission') || message.includes('review')) {
      return "To review worker submissions, go to 'My Campaigns' and click on any campaign to see submissions. You can approve or reject based on the proof provided.";
    } else if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! You can also contact our support team via WhatsApp at +2347035802057 or email at support@dailyhustle.com for more detailed assistance.";
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello there! I'm Mr. Daily Hustler, your AI assistant. I'm here to help you with campaigns, payments, worker management, and any other questions about DailyHustle!";
    } else {
      return "I understand you're asking about: '" + userMessage + "'. Could you be more specific? I can help with campaigns, payments, worker submissions, or general platform questions.";
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: palette.red,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <i className={`bi ${isOpen ? 'bi-x' : 'bi-chat-dots'}`} style={{ fontSize: '24px', color: '#fff' }}></i>
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '350px',
          height: '500px',
          background: palette.cardBg,
          border: `1px solid ${palette.border}`,
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          zIndex: 1049,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Header */}
          <Card.Header style={{
            background: palette.red,
            color: '#fff',
            borderRadius: '16px 16px 0 0',
            padding: '16px 20px',
            borderBottom: 'none'
          }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-robot" style={{ fontSize: '20px', color: palette.red }}></i>
              </div>
              <div>
                <h6 style={{ margin: 0, fontWeight: 'bold' }}>Mr. Daily Hustler</h6>
                <small style={{ opacity: 0.9 }}>AI Assistant</small>
              </div>
            </div>
          </Card.Header>

          {/* Messages Area */}
          <Card.Body style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            background: palette.cardBg
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: message.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: message.sender === 'user' ? palette.red : palette.input,
                    color: message.sender === 'user' ? '#fff' : palette.text,
                    border: message.sender === 'bot' ? `1px solid ${palette.border}` : 'none'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="d-flex justify-content-start mb-3">
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  background: palette.input,
                  border: `1px solid ${palette.border}`
                }}>
                  <div className="d-flex gap-1">
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: palette.label,
                      animation: 'typing 1.4s infinite ease-in-out'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: palette.label,
                      animation: 'typing 1.4s infinite ease-in-out 0.2s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: palette.label,
                      animation: 'typing 1.4s infinite ease-in-out 0.4s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Card.Body>

          {/* Input Area */}
          <div style={{
            padding: '16px',
            borderTop: `1px solid ${palette.border}`,
            background: palette.cardBg,
            borderRadius: '0 0 16px 16px'
          }}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  background: palette.input,
                  border: `1px solid ${palette.border}`,
                  color: palette.text,
                  borderRadius: '8px 0 0 8px'
                }}
              />
              <Button
                onClick={handleSendMessage}
                style={{
                  background: palette.red,
                  border: 'none',
                  borderRadius: '0 8px 8px 0',
                  padding: '0 16px'
                }}
              >
                <i className="bi bi-send"></i>
              </Button>
            </InputGroup>
          </div>
        </Card>
      )}

      <style>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}