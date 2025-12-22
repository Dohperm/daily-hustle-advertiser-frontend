import { useMemo, useState, useEffect } from "react";
import { useAdvertiserData } from "../hooks/useAppDataContext";
import { useTheme } from "../../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { advertiserWalletBalance, advertiserTransactions, advertiserTotalSpent, initializePayment } from "../services/services";
import {
  Wallet,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { toast } from "react-toastify";

export default function AdvertiserWallet() {
  const { theme } = useTheme();
  const { wallet, onAddFunds, userAppData } = useAdvertiserData();
  const location = useLocation();
  const [walletData, setWalletData] = useState({ balance: 0, transactions: [] });
  const [transactions, setTransactions] = useState([]);
  const [totalSpent, setTotalSpent] = useState({ total_spent: 0, currency: 'NGN' });
  const [loading, setLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [totalSpentLoading, setTotalSpentLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const itemsPerPage = 10;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch wallet balance and transactions from API
  useEffect(() => {
    async function fetchWalletData() {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setWalletData({ balance: 0, transactions: [] });
        setTransactions([]);
        return;
      }
      
      // Fetch balance
      setLoading(true);
      try {
        const response = await advertiserWalletBalance();
        const balance = response?.data?.data?.balance || 0;
        setWalletData({ balance, transactions: [] });
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
        setWalletData({ balance: 0, transactions: [] });
      } finally {
        setLoading(false);
      }

      // Fetch transactions
      fetchTransactions(1);

      // Fetch total spent
      setTotalSpentLoading(true);
      try {
        const response = await advertiserTotalSpent();
        const spentData = response?.data?.data || { total_spent: 0, currency: 'NGN' };
        setTotalSpent(spentData);
      } catch (error) {
        console.error('Failed to fetch total spent:', error);
        setTotalSpent({ total_spent: 0, currency: 'NGN' });
      } finally {
        setTotalSpentLoading(false);
      }
    }
    fetchWalletData();
  }, []);

  // Fetch transactions with pagination
  const fetchTransactions = async (pageNo = 1) => {
    console.log('Fetching transactions for page:', pageNo);
    setTransactionsLoading(true);
    try {
      const response = await advertiserTransactions(`?pageNo=${pageNo}&limitNo=${itemsPerPage}&order=-1`);
      const data = response?.data?.data || {};
      const transactionData = data.data || [];
      const metadata = data.metadata || {};
      
      setTransactions(Array.isArray(transactionData) ? transactionData : []);
      setCurrentPage(pageNo);
      setTotalPages(Math.ceil((metadata.total || 0) / itemsPerPage));
      setTotalTransactions(metadata.total || 0);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchTransactions(page);
    }
  };

  // Refresh wallet data when returning from payment
  useEffect(() => {
    if (location.state?.paymentSuccess) {
      refreshWalletData();
    }
  }, [location.state]);

  // Refresh wallet data function
  const refreshWalletData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await advertiserWalletBalance();
      const balance = response?.data?.data?.balance || 0;
      setWalletData({ balance, transactions: [] });
    } catch (error) {
      console.error('Failed to refresh wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use API data if token exists, otherwise use context data
  const hasToken = localStorage.getItem('token');
  const currentWallet = hasToken ? walletData : wallet;

  const isDark = theme === "dark";
  const palette = useMemo(
    () => ({
      bg: isDark ? "#121212" : "#f8f9fa",
      cardBg: isDark ? "#1c1c1e" : "#fff",
      text: isDark ? "#f7f7fa" : "#212529",
      label: isDark ? "#adb5bd" : "#6c757d",
      muted: isDark ? "#cad1e1" : "#6c757d",
      red: "#ed3224",
      success: "#28a745",
      danger: "#dc3545",
      border: isDark ? "#313843" : "#dee2e6",
    }),
    [isDark]
  );

  return (
    <div
      className="container py-4"
      style={{
        background: palette.bg,
        minHeight: "100vh",
        color: palette.text,
      }}
    >
      {/* HEADER */}
      <div className="mb-5">
        <h1
          className="fw-bold mb-2"
          style={{
            fontSize: "2rem",
            color: palette.text,
            letterSpacing: "0.5px",
          }}
        >
          <Wallet size={32} style={{ color: palette.red }} className="me-2" />
          Wallet & Billing
        </h1>
        <p style={{ color: palette.label }}>
          Manage your funds and view transaction history
        </p>
      </div>

      {/* BALANCE CARD */}
      <div className="row mb-4 g-4">
        <div className="col-lg-6 col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              background: palette.cardBg,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${palette.red}, #ff6b5b)`,
                height: "6px",
              }}
            />
            <div className="card-body p-4">
              <div
                className="mb-3"
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: palette.label,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Current Balance 
              </div>
              <h2
                className="fw-bold mb-4"
                style={{
                  fontSize: "2.5rem",
                  color: palette.red,
                  lineHeight: "1",
                }}
              >
                {loading ? (
                  <div className="d-flex align-items-center gap-2">
                    <div className="spinner-border spinner-border-sm" role="status" style={{ color: palette.red }}></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  `₦${currentWallet.balance?.toLocaleString() || "0"}`
                )}
              </h2>
              <button
                className="btn fw-bold rounded-pill w-100"
                style={{
                  backgroundColor: palette.red,
                  color: "#fff",
                  padding: "12px 24px",
                  fontSize: "1rem",
                  border: "none",
                  transition: "all 0.3s ease",
                  boxShadow: `0 4px 15px ${palette.red}40`,
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = `0 6px 20px ${palette.red}60`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = `0 4px 15px ${palette.red}40`;
                }}
                onClick={() => setShowPaymentModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Funds
              </button>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="col-lg-6 col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              background: palette.cardBg,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${palette.danger}, #ff6b5b)`,
                height: "6px",
              }}
            />
            <div className="card-body p-4">
              <div
                className="mb-3"
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: palette.label,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Total Spent
              </div>
              <h3
                className="fw-bold mb-4"
                style={{
                  fontSize: "1.8rem",
                  color: palette.danger,
                  lineHeight: "1",
                }}
              >
                {totalSpentLoading ? (
                  <div className="d-flex align-items-center gap-2">
                    <div className="spinner-border spinner-border-sm" role="status" style={{ color: palette.danger }}></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  `${totalSpent.currency === 'NGN' ? '₦' : totalSpent.currency}${totalSpent.total_spent?.toLocaleString() || '0'}`
                )}
              </h3>
            </div>
          </div>
        </div>

        {/* <div className="col-lg-4 col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              background: palette.cardBg,
              borderRadius: "16px",
            }}
          >
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div className="mb-3 d-flex align-items-center justify-content-between">
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: palette.label,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total Received
                </span>
                <ArrowUpRight size={20} style={{ color: palette.success }} />
              </div>
              <h3
                className="fw-bold"
                style={{
                  fontSize: "1.8rem",
                  color: palette.success,
                }}
              >
                ₦
                {currentWallet.transactions
                  ?.filter((t) => t.amount > 0)
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString() || "0"}
              </h3>
            </div>
          </div>
        </div> */}
      </div>

      {/* TRANSACTIONS SECTION */}
      <div
        className="card border-0 shadow-sm"
        style={{
          background: palette.cardBg,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          className="card-header border-0 p-4"
          style={{
            background: palette.bg,
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <h5
            className="fw-bold mb-0"
            style={{
              fontSize: "1.1rem",
              color: palette.text,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Calendar size={20} style={{ color: palette.red }} />
            Transaction History
          </h5>
        </div>

        <div className="card-body p-4">
          {transactionsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: palette.red }} role="status"></div>
              <p className="mt-3 mb-0" style={{ color: palette.label }}>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div
              className="text-center py-5"
              style={{
                background: palette.bg,
                borderRadius: "12px",
                color: palette.label,
              }}
            >
              <i
                className="bi bi-inbox"
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "10px",
                  display: "block",
                }}
              ></i>
              <p className="mb-0">No transactions yet.</p>
            </div>
          ) : (
            <div className="table-responsive" style={{ backgroundColor: palette.cardBg }}>
              <table
                className="table mb-0"
                style={{ color: palette.text, backgroundColor: palette.cardBg, '--bs-table-bg': palette.cardBg }}
              >
                <thead style={{ borderColor: palette.border, backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }}>
                  <tr style={{ borderBottom: `2px solid ${palette.border}` }}>
                    <th
                      className="fw-bold small"
                      style={{
                        color: palette.label,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "12px 16px",
                      }}
                    >
                      Description
                    </th>
                    <th
                      className="fw-bold small"
                      style={{
                        color: palette.label,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "12px 16px",
                      }}
                    >
                      Date
                    </th>
                    <th
                      className="fw-bold small text-end"
                      style={{
                        color: palette.label,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "12px 16px",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: palette.cardBg }}>
                  {transactions.map((txn, index) => {
                    const isCredit = txn.type?.toLowerCase() === 'credit';
                    return (
                      <tr
                        key={txn._id || index}
                        style={{
                          borderBottom: `1px solid ${palette.border}`,
                          transition: "background 0.2s",
                          backgroundColor: palette.cardBg
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = palette.bg)
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = palette.cardBg)
                        }
                      >
                        <td style={{ padding: "16px", color: palette.text, backgroundColor: palette.cardBg }}>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                background: isCredit
                                  ? `${palette.success}20`
                                  : `${palette.danger}20`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: isCredit
                                  ? palette.success
                                  : palette.danger,
                              }}
                            >
                              {isCredit ? (
                                <ArrowDownLeft size={18} />
                              ) : (
                                <ArrowUpRight size={18} />
                              )}
                            </div>
                            <span className="fw-semibold">{txn.description || txn.type || 'Transaction'}</span>
                          </div>
                        </td>
                        <td style={{ padding: "16px", color: palette.label, backgroundColor: palette.cardBg }}>
                          <div className="d-flex align-items-center gap-1">
                            <Calendar size={16} />
                            {new Date(txn.createdAt || txn.date).toLocaleDateString("en-NG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "right",
                            fontWeight: "600",
                            color: isCredit ? palette.success : palette.danger,
                            backgroundColor: palette.cardBg
                          }}
                        >
                          {isCredit ? "+" : "-"}₦
                          {txn.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4 px-4 pb-4">
              <div style={{ color: palette.label, fontSize: '0.9rem' }}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalTransactions)} of {totalTransactions} transactions
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || transactionsLoading}
                  style={{
                    background: palette.bg,
                    color: palette.text,
                    border: `1px solid ${palette.border}`,
                    borderRadius: '6px'
                  }}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className="btn btn-sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={transactionsLoading}
                      style={{
                        background: currentPage === pageNum ? palette.red : palette.bg,
                        color: currentPage === pageNum ? '#fff' : palette.text,
                        border: `1px solid ${currentPage === pageNum ? palette.red : palette.border}`,
                        borderRadius: '6px',
                        minWidth: '35px'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  className="btn btn-sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || transactionsLoading}
                  style={{
                    background: palette.bg,
                    color: palette.text,
                    border: `1px solid ${palette.border}`,
                    borderRadius: '6px'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: palette.cardBg, border: 'none' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: palette.text }}>Add Funds</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPaymentModal(false)}
                  style={{ filter: isDark ? 'invert(1)' : 'none' }}
                ></button>
              </div>
              <div className="modal-body pt-2">
                <div className="mb-3">
                  <label className="form-label" style={{ color: palette.label }}>Amount (₦)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="100"
                    style={{
                      background: palette.bg,
                      border: `1px solid ${palette.border}`,
                      color: palette.text,
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowPaymentModal(false)}
                  style={{
                    background: palette.bg,
                    color: palette.text,
                    border: `1px solid ${palette.border}`,
                    borderRadius: '8px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={handlePayment}
                  disabled={!amount || amount < 100 || paymentLoading}
                  style={{
                    backgroundColor: palette.red,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  {paymentLoading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  async function handlePayment() {
    if (!amount || amount < 100) return;
    
    setPaymentLoading(true);
    try {
      const response = await initializePayment(Number(amount));
      const authUrl = response?.data?.data?.authorization_url;
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        toast.error('Payment initialization failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment initialization failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  }
}


// just want to push thanks