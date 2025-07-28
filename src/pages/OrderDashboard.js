import React, { useState, useEffect, useCallback, useContext } from 'react'; // Import useContext
import '../OrderDashboard.css';
import { FaHome, FaList, FaHandPointer, FaUserCircle, FaCog } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios
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
        <div className="order-dashboard">
            {/* Stats Section */}
            <div className="stats-container">
                <div className="stat-box">
                    <div className="stat-number">{counts.uncompletedOrders}</div>
                    <div className="stat-label">{t('uncompletedOrders')}</div> {/* Translated */}
                </div>
                <div className="stat-box">
                    <div className="stat-number">{counts.completedOrders}</div>
                    <div className="stat-label">{t('completedOrders')}</div> {/* Translated */}
                </div>
                <div className="stat-box">
                    <div className="stat-number">{counts.dailyOrders}</div>
                    <div className="stat-label">{t('dailyOrders')}</div> {/* Translated */}
                </div>
            </div>

            {/* Action Button */}
            <div className="action-button">
                <button onClick={handleStartOrderTask}>{t('startOrderTask')}</button> {/* Translated */}
            </div>

            {/* You can add your navigation icons back here if they were removed for brevity */}
            {/* <div className="navbar">
                <div className="nav-item">
                    <FaHome />
                    <span>Home</span>
                </div>
                <div className="nav-item">
                    <FaList />
                    <span>Orders</span>
                </div>
                <div className="nav-item active">
                    <FaHandPointer />
                    <span>Task</span>
                </div>
                <div className="nav-item">
                    <FaUserCircle />
                    <span>Me</span>
                </div>
                <div className="nav-item">
                    <FaCog />
                    <span>Settings</span>
                </div>
            </div> */}
        </div>
    );
};

export default OrderDashboard;
