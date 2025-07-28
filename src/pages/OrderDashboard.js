import "../OrderDashboard.css";
import {
  FaHome, FaList, FaHandPointer, FaUserCircle, FaCog // Added for completeness based on commented out section
} from "react-icons/fa";
import { useEffect, useState, useCallback, useContext } from "react"; // Import useContext
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ChatWidget from "../pages/ChatWidget"; // Make sure to import ChatWidget
import { LanguageContext } from './LanguageGlobe'; // Import LanguageContext

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const OrderDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useContext(LanguageContext); // Consume the translation function from context

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [idx, setIdx] = useState(0);
  const phones = ["+4479616687", "+1234567890", "+1987654321", "+441234567890"];
  // Use translation keys for FAQ questions and answers
  const faqs = [
    { question: t('faq1Question'), answer: t('faq1Answer') },
    { question: t('faq2Question'), answer: t('faq2Answer') },
    { question: t('faq3Question'), answer: t('faq3Answer') },
  ];
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => setOpenFaq((prev) => (prev === index ? null : index));

  const [balanceInUsd, setBalanceInUsd] = useState(0);
  const [rawTrxBalance, setRawTrxBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // State to control chat widget visibility
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        handleLogout();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.openChat) {
      setIsChatOpen(true);
      if (location.state.initialChatMessage) {
        setInitialChatMessage(location.state.initialChatMessage);
      }
    }
  }, [location.state]);

  const fetchDashboardSummary = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/tasks/dashboard-summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCounts(response.data);
    } catch (err) {
      console.error("Error fetching dashboard summary:", err);
      setError(err.response?.data?.message || t('failedLoadSummary')); // Translated
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, navigate, t]); // Added t to dependency array

  const fetchLiveBalance = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingBalance(true);
    try {
      const userProfilePromise = axios.get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pricePromise = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd');

      const [userResponse, priceResponse] = await Promise.all([userProfilePromise, pricePromise]);

      const userData = userResponse.data.user;
      const trxPrice = priceResponse.data.tron.usd;

      if (userData.wallet_balance && trxPrice) {
        setRawTrxBalance(parseFloat(userData.wallet_balance));
        setBalanceInUsd(parseFloat(userData.wallet_balance) * trxPrice);
      } else {
        setRawTrxBalance(0);
        setBalanceInUsd(0);
      }
    } catch (error) {
      console.error("Failed to fetch live balance:", error);
    } finally {
      setLoadingBalance(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchLiveBalance();
  }, [location, fetchLiveBalance]);

  useEffect(() => {
    fetchDashboardSummary(); // Call the summary fetch here
  }, [fetchDashboardSummary]); // Dependency array includes fetchDashboardSummary

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductsError(null);
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProductsError(t('errorLoadingProducts')); // Translated
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [API_BASE_URL, t]); // Add t to dependency array

  useEffect(() => {
    const t = setInterval(() => setIdx((prev) => (prev + 1) % phones.length), 1000);
    return () => clearInterval(t);
  }, [phones.length]);

  const handleStartOrderTask = () => {
    navigate('/product-rating');
  };

  if (loading) {
    return (
      <div className="order-dashboard">
        <div className="stats-container">
          <div className="stat-box">{t('loadingText')}</div> {/* Translated */}
          <div className="stat-box">{t('loadingText')}</div> {/* Translated */}
          <div className="stat-box">{t('loadingText')}</div> {/* Translated */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-dashboard">
        <p className="error-message">Error: {error}</p>
        <button onClick={fetchDashboardSummary}>{t('retryButton')}</button> {/* Translated */}
      </div>
    );
  }

  return (
    <main className="main-content">
      <header className="dashboard-header">
        <div className="user-info">
          <FaUser className="icon" />
          {user && <span className="username">{user.username}</span>}
          <button onClick={handleLogout} className="logout-button">{t('logoutButton')}</button> {/* Translated */}
        </div>

        <div className="balance">
          {loadingBalance ? (
            <span className="amount">{t('loadingText')}</span> {/* Translated */}
          ) : (
            <>
              <span className="amount">{balanceInUsd.toFixed(2)}</span>
              <span className="currency">{t('currencySymbol')}</span> {/* Translated */}
              <small className="raw-balance">{rawTrxBalance.toFixed(2)} TRX</small>
              <button onClick={() => navigate("/recharge")} className="add-balance-button" title={t('addFundsButton')}>+</button> {/* Translated title */}
            </>
          )}
        </div>
      </header>

      <section className="product-section">
        <h2>{t('topProductsHeading')}</h2> {/* Translated */}
        {loadingProducts ? (
          <p>{t('loadingProductsText')}</p> {/* Translated */}
        ) : productsError ? (
          <p style={{ color: 'red' }}>{productsError} 🙁</p>
        ) : products.length > 0 ? (
          <div className="product-scroll">
            {products.map((product) => (
              <div className="product-card" key={product.id} onClick={() => navigate("/product-rating", { state: { product } })}>
                <img src={product.image} alt={product.name} className="product-image" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/175x175/cccccc/white?text=No+Image"; }} />
                <div className="product-name">{product.name}</div>
                <div className="product-price">{t('currencySymbol')}{product.price ? product.price.toFixed(2) : 'N/A'}</div> {/* Translated currency symbol */}
              </div>
            ))}
          </div>
        ) : (
          <p>{t('noProductsFound')}</p> {/* Translated */}
        )}
      </section>
      <div className="congrats-text">
        <div className="slide-in">{t('congratulationsPrefix')} {phones[idx]}</div> {/* Translated */}
      </div>
      <button className="start-button" onClick={handleStartOrderTask}>{t('startMakingMoneyButton')}</button> {/* Translated */}
      <section className="additional-info">
        <h2>{t('aboutUsHeading')}</h2> {/* Translated */}
        <p>{t('aboutUsText')}</p> {/* Translated */}
        <h3>{t('latestIncidentHeading')}</h3> {/* Translated */}
        <p>{t('noReportedIncidents')}</p> {/* Translated */}
        <h3>{t('trcHeading')}</h3> {/* Translated */}
        <p>{t('trcText')}</p> {/* Translated */}
        <h3>{t('faqHeading')}</h3> {/* Translated */}
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className={`faq-item ${openFaq === index ? "active" : ""}`} key={index}>
              <div className="faq-question" onClick={() => toggleFaq(index)}>{faq.question}</div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}
        </div>
        <section className="partnered-section">
          <h2>{t('partneredWithHeading')}</h2> {/* Translated */}
          <div className="partners-logos">
            <div className="partner-logo-placeholder">{t('partnerPlaceholder')} 1</div> {/* Translated */}
            <div className="partner-logo-placeholder">{t('partnerPlaceholder')} 2</div> {/* Translated */}
            <div className="partner-logo-placeholder">{t('partnerPlaceholder')} 3</div> {/* Translated */}
          </div>
        </section>
      </section>
      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage={initialChatMessage}
      />
    </main>
  );
};

export default OrderDashboard;
