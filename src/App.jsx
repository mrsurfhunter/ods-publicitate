import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ConfigProvider, useConfig } from "./context/ConfigContext";
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
import AdminView from "./components/admin/AdminView";
import LoginModal from "./components/auth/LoginModal";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { ToastProvider } from "./components/shared/Toast";

const HASH_VIEWS = ["consult", "catalog", "anunturi", "admin", "chat", "dashboard"];

function getViewFromHash() {
  const hash = window.location.hash.replace("#", "");
  if (HASH_VIEWS.includes(hash)) return hash;
  return "landing";
}

function AppInner() {
  const { user, isAuthenticated } = useAuth();
  const { packages } = useConfig();
  const [view, setViewRaw] = useState(getViewFromHash);
  const [recommendation, setRecommendation] = useState(null);
  const [dashOrder, setDashOrder] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const setView = (v) => {
    setViewRaw(v);
    if (v === "landing") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      window.location.hash = v;
    }
  };

  useEffect(() => {
    if (dashOrder) sessionStorage.setItem("ods-dash-order", dashOrder.id);
  }, [dashOrder]);

  useEffect(() => { sld("ods-orders", []).then(setMyOrders); }, []);

  useEffect(() => {
    if (view === "dashboard" && !dashOrder && myOrders.length > 0) {
      const lastId = sessionStorage.getItem("ods-dash-order");
      const order = lastId ? myOrders.find(o => o.id === lastId) : myOrders[0];
      if (order) setDashOrder(order);
      else setViewRaw("landing");
    }
  }, [myOrders]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (HASH_VIEWS.includes(hash)) {
        if (hash === "dashboard") {
          const lastId = sessionStorage.getItem("ods-dash-order");
          sld("ods-orders", []).then(orders => {
            const order = lastId ? orders.find(o => o.id === lastId) : orders[0];
            if (order) { setDashOrder(order); setViewRaw("dashboard"); }
          });
        } else {
          setViewRaw(hash);
        }
      } else if (!hash) {
        setViewRaw("landing");
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const goHome = () => { setView("landing"); setDashOrder(null); setRecommendation(null); };

  const handleConsultResult = (result) => {
    if (result?.tiers) {
      setRecommendation(result);
      setView("recommend");
    } else if (result) {
      setRecommendation(result);
      setView("recommend");
    } else {
      setView("catalog");
    }
  };

  const handleChatFinish = (pkgId) => {
    const pkg = packages.find(p => p.id === pkgId);
    if (pkg) {
      setRecommendation({
        tiers: [{
          id: pkgId, tier: "recommended", label: "Recomandat pentru tine",
          reasoning: `Pe baza conversației, ${pkg.name} este cel mai potrivit pentru afacerea ta.`,
          benefits: pkg.inc.slice(0, 4).map(x => x.w + (x.d ? " — " + x.d : "")),
          addons: [],
        }],
        summary: `Pe baza conversației, pachetul ${pkg.name} este cel mai potrivit pentru afacerea ta.`,
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
      {view !== "admin" && (
        <TopBar
          myOrders={myOrders}
          onHome={goHome}
          onOpenOrder={handleOpenOrder}
          onLogin={() => setShowLogin(true)}
          onConsult={() => setView("consult")}
          onDashboard={myOrders.length > 0 ? () => { setDashOrder(myOrders[0]); setView("dashboard"); } : undefined}
        />
      )}

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

      {view === "admin" && (
        <AdminView onBack={goHome} />
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
        <ConfigProvider>
          <ToastProvider>
            <AppInner />
          </ToastProvider>
        </ConfigProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
