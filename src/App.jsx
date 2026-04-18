import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { sld } from "./utils/storage";
import { saveOrderToServer } from "./utils/orders";
import TopBar from "./components/layout/TopBar";
import Footer from "./components/layout/Footer";
import LandingView from "./components/landing/LandingView";
import ConsultView from "./components/consult/ConsultView";
import ChatConsultant from "./components/consult/ChatConsultant";
import RecommendView from "./components/recommend/RecommendView";
import CatalogView from "./components/catalog/CatalogView";
import AnunturiView from "./components/anunturi/AnunturiView";
import DashboardView from "./components/dashboard/DashboardView";
import LoginModal from "./components/auth/LoginModal";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { ToastProvider } from "./components/shared/Toast";
import { PKG } from "./data/packages";

function AppInner() {
  const { user, isAuthenticated } = useAuth();
  const [view, setView] = useState("landing");
  const [recommendation, setRecommendation] = useState(null);
  const [dashOrder, setDashOrder] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => { sld("ods-orders", []).then(setMyOrders); }, []);

  const goHome = () => { setView("landing"); setDashOrder(null); setRecommendation(null); };

  const handleConsultResult = (result) => {
    if (result) {
      setRecommendation(result);
      setView("recommend");
    } else {
      setView("catalog");
    }
  };

  const handleChatFinish = (pkgId) => {
    const pkg = PKG.find(p => p.id === pkgId);
    if (pkg) {
      setRecommendation({
        primary: pkgId,
        secondary: null,
        reasoning: `Pe baza conversației, pachetul ${pkg.name} este cel mai potrivit pentru afacerea ta.`,
        primaryBenefits: pkg.inc.slice(0, 4).map(x => x.w + (x.d ? " — " + x.d : "")),
        secondaryBenefits: [],
      });
      setView("recommend");
    }
  };

  const handlePurchased = (order) => {
    setDashOrder(order);
    setView("dashboard");
    sld("ods-orders", []).then(setMyOrders);
    saveOrderToServer(order);
  };

  const handleOpenOrder = (orderId) => {
    const o = myOrders.find(x => x.id === orderId);
    if (o) { setDashOrder(o); setView("dashboard"); }
  };

  const handleLoggedIn = () => {
    sld("ods-orders", []).then(orders => {
      setMyOrders(orders);
      if (orders.length > 0) {
        setDashOrder(orders[0]);
        setView("dashboard");
      }
    });
  };

  const showFooter = view === "landing" || view === "catalog" || view === "anunturi";

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar
        myOrders={myOrders}
        onHome={goHome}
        onOpenOrder={handleOpenOrder}
        onLogin={() => setShowLogin(true)}
        onConsult={() => setView("consult")}
        onDashboard={myOrders.length > 0 ? () => { setDashOrder(myOrders[0]); setView("dashboard"); } : undefined}
      />

      {view === "landing" && (
        <LandingView
          onConsult={() => setView("consult")}
          onAnunturi={() => setView("anunturi")}
          onCatalog={() => setView("catalog")}
        />
      )}

      {view === "consult" && (
        <ConsultView onResult={handleConsultResult} onBack={goHome} />
      )}

      {view === "chat" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ChatConsultant onFinish={handleChatFinish} />
          <div className="text-center mt-6">
            <button className="text-slate-400 text-sm font-semibold hover:text-slate-700 transition-colors" onClick={goHome}>
              ← Pagina principală
            </button>
          </div>
        </div>
      )}

      {view === "recommend" && recommendation && (
        <RecommendView
          recommendation={recommendation}
          onCatalog={() => setView("catalog")}
          onPurchased={handlePurchased}
          onBack={() => setView("consult")}
        />
      )}

      {view === "catalog" && (
        <CatalogView onConsult={() => setView("consult")} onPurchased={handlePurchased} />
      )}

      {view === "anunturi" && (
        <AnunturiView onBack={goHome} onConsult={() => setView("consult")} />
      )}

      {view === "dashboard" && dashOrder && (
        <DashboardView initOrder={dashOrder} onBack={goHome} />
      )}

      {showFooter && <Footer />}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLoggedIn={handleLoggedIn} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AppInner />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
