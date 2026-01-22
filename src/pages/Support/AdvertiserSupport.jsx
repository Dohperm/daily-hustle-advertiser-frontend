import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Accordion, InputGroup } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';

export default function AdvertiserSupport() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '' });

  const palette = {
    bg: isDark ? '#121212' : '#f8f9fa',
    cardBg: isDark ? '#1c1c1e' : '#fff',
    text: isDark ? '#f7f7fa' : '#212529',
    label: isDark ? '#adb5bd' : '#6c757d',
    border: isDark ? '#313843' : '#dee2e6',
    red: '#e53e3e',
    input: isDark ? '#1c1c1e' : '#fff',
  };

  const faqData = [
    {
      question: 'How do I create my first campaign?',
      answer: 'Go to "Create New Campaign" from the sidebar, select a campaign type from the available options, fill in the campaign details including title, description, instructions, and budget. Set your worker requirements and approval settings, then click "Post Campaign" to make it live.'
    },
    {
      question: 'How do I fund my campaigns?',
      answer: 'Visit your Wallet page to add funds to your account. You can top up using various payment methods including bank transfers, cards, or mobile money. Ensure you have sufficient balance to cover your campaign budget plus the 15% platform fee.'
    },
    {
      question: 'How do I review worker submissions?',
      answer: 'Go to "My Campaigns" to see all your active campaigns. Click on any campaign to view worker submissions. You can approve or reject submissions based on the proof provided. Workers will be paid automatically upon approval.'
    },
    {
      question: 'What is the platform fee for employers?',
      answer: 'DailyHustle charges a 15% platform fee on top of your campaign budget. This fee covers platform maintenance, payment processing, and support services. The total amount will be calculated automatically when you create a campaign.'
    },
    {
      question: 'How long do campaigns take to get workers?',
      answer: 'Campaign visibility depends on the task type and reward amount. Popular tasks like social media engagement typically get workers within hours, while specialized tasks may take 1-2 days. Higher rewards attract workers faster.'
    },
    {
      question: 'Can I edit my campaign after posting?',
      answer: 'You can edit campaign details like title, description, and instructions from the "View Campaign" page. However, you cannot change the budget or worker slots once workers have started applying. Contact support for major changes.'
    },
    {
      question: 'What approval modes are available?',
      answer: 'You can choose between "Self Approval" (you manually review each submission) or "Platform Approval" (our team reviews submissions based on your criteria). Self approval gives you more control, while platform approval saves time.'
    },
    {
      question: 'How do I track campaign performance?',
      answer: 'Visit "My Campaigns" to see real-time statistics including applications received, approvals made, and remaining budget. You can also view individual worker submissions and their completion status.'
    }
  ];

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    // Handle ticket submission logic here
    console.log('Ticket submitted:', ticketForm);
    alert('Support ticket submitted successfully!');
    setTicketForm({ subject: '', message: '' });
  };

  const handleContactMethod = (method) => {
    if (method === 'whatsapp') {
      window.open('https://wa.me/2347035802057', '_blank');
    } else if (method === 'email') {
      window.location.href = 'mailto:support@dailyhustle.com';
    }
  };

  return (
    <div style={{ 
      background: palette.bg, 
      color: palette.text, 
      minHeight: '100vh',
      padding: window.innerWidth < 768 ? '20px 10px' : '40px 20px'
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
            <div style={{
              width: '60px',
              height: '60px',
              background: `${palette.red}20`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="bi bi-headset" style={{ fontSize: '24px', color: palette.red }}></i>
            </div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: palette.red,
              margin: 0
            }}>
              Support Center
            </h1>
          </div>
          <p style={{ color: palette.label, fontSize: '1.1rem' }}>
            We're always here to help, jerry11671!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex justify-content-center mb-4">
          <div className="d-flex gap-2 flex-wrap justify-content-center" style={{
            background: palette.cardBg,
            padding: '8px',
            borderRadius: '12px',
            border: `1px solid ${palette.border}`
          }}>
            {[
              { key: 'faq', label: 'FAQ', icon: 'bi-question-circle' },
              { key: 'tickets', label: 'Support Tickets', icon: 'bi-ticket-perforated' },
              { key: 'contact', label: 'Contact', icon: 'bi-telephone' }
            ].map(tab => (
              <Button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: activeTab === tab.key ? palette.red : 'transparent',
                  border: 'none',
                  color: activeTab === tab.key ? '#fff' : palette.text,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div style={{ minHeight: '60vh', padding: '0 40px' }}>
            {/* Search Bar */}
            <div className="row justify-content-center mb-4">
              <div className="col-md-8">
                <InputGroup style={{
                  background: palette.cardBg,
                  border: `1px solid ${palette.border}`,
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <InputGroup.Text style={{
                    background: 'transparent',
                    border: 'none',
                    color: palette.red
                  }}>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: palette.text,
                      fontSize: '1rem'
                    }}
                  />
                </InputGroup>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <Accordion>
                  {filteredFAQs.map((faq, index) => (
                    <Accordion.Item 
                      key={index} 
                      eventKey={index.toString()}
                      style={{
                        background: palette.cardBg,
                        border: `1px solid ${palette.border}`,
                        borderRadius: '12px',
                        marginBottom: '12px',
                        overflow: 'hidden'
                      }}
                    >
                      <Accordion.Header style={{
                        background: palette.cardBg,
                        color: palette.text,
                        fontWeight: '600'
                      }}>
                        {faq.question}
                      </Accordion.Header>
                      <Accordion.Body style={{
                        background: palette.cardBg,
                        color: palette.label,
                        lineHeight: '1.6'
                      }}>
                        {faq.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="row justify-content-center" style={{ minHeight: '60vh', padding: '0 40px' }}>
            <div className="col-lg-8">
              <Card style={{
                background: palette.cardBg,
                border: `1px solid ${palette.border}`,
                borderRadius: '16px',
                boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Card.Body style={{ padding: '40px' }}>
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <i className="bi bi-ticket-perforated" style={{ fontSize: '24px', color: palette.red }}></i>
                    <h3 style={{ color: palette.text, margin: 0, fontWeight: 'bold' }}>
                      Submit a Support Ticket
                    </h3>
                  </div>
                  
                  <Form onSubmit={handleTicketSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: palette.text, fontWeight: '600', marginBottom: '12px' }}>
                        Subject
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                        required
                        style={{
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: '8px',
                          color: palette.text,
                          padding: '12px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: palette.text, fontWeight: '600', marginBottom: '12px' }}>
                        Message
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        value={ticketForm.message}
                        onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                        required
                        style={{
                          background: palette.input,
                          border: `1px solid ${palette.border}`,
                          borderRadius: '8px',
                          color: palette.text,
                          padding: '12px 16px',
                          fontSize: '1rem',
                          resize: 'vertical'
                        }}
                      />
                    </Form.Group>
                    
                    <Button
                      type="submit"
                      style={{
                        background: palette.red,
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 32px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <i className="bi bi-send"></i>
                      Submit Ticket
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="row justify-content-center" style={{ minHeight: '60vh', padding: '0 40px' }}>
            <div className="col-lg-10">
              <Row className="g-4">
                <Col md={6}>
                  <Card 
                    onClick={() => handleContactMethod('whatsapp')}
                    style={{
                      background: palette.cardBg,
                      border: '2px solid #25D366',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '200px'
                    }}
                    className="h-100"
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#25D366',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px'
                      }}>
                        <i className="bi bi-whatsapp" style={{ fontSize: '24px', color: '#fff' }}></i>
                      </div>
                      <h4 style={{ color: palette.text, fontWeight: 'bold', marginBottom: '8px' }}>
                        WhatsApp
                      </h4>
                      <p style={{ color: palette.label, margin: 0 }}>
                        Instant assistance (24/7)
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card 
                    onClick={() => handleContactMethod('email')}
                    style={{
                      background: palette.cardBg,
                      border: `2px solid ${palette.red}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '200px'
                    }}
                    className="h-100"
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = `0 8px 25px ${palette.red}40`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: palette.red,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px'
                      }}>
                        <i className="bi bi-envelope" style={{ fontSize: '24px', color: '#fff' }}></i>
                      </div>
                      <h4 style={{ color: palette.text, fontWeight: 'bold', marginBottom: '8px' }}>
                        Email Support
                      </h4>
                      <p style={{ color: palette.label, margin: 0 }}>
                        Reach us anytime
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}