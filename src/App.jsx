import { useState, useEffect } from "react";
import { sld } from "./utils/storage";
import TopBar from "./components/layout/TopBar";
import Footer from "./components/layout/Footer";
import LandingView from "./components/landing/LandingView";
import ConsultView from "./components/consult/ConsultView";
import RecommendView from "./components/recommend/RecommendView";
import CatalogView from "./components/catalog/CatalogView";
import AnunturiView from "./components/anunturi/AnunturiView";
import DashboardView from "./components/dashboard/DashboardView";

export default function App() {
  const [view, setView] = useState("landing");
  const [recommendation, setRecommendation] = useState(null);
  const [dashOrder, setDashOrder] = useState(null);
  const [myOrders, setMyOrders] = useState([]);

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

  const handlePurchased = (order) => {
    setDashOrder(order);
    setView("dashboard");
    sld("ods-orders", []).then(setMyOrders);
  };

  const handleOpenOrder = (orderId) => {
    const o = myOrders.find(x => x.id === orderId);
    if (o) { setDashOrder(o); setView("dashboard"); }
  };

  const showFooter = view === "landing" || view === "catalog" || view === "anunturi";

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
      <TopBar myOrders={myOrders} onHome={goHome} onOpenOrder={handleOpenOrder} />

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
        <AnunturiView onBack={goHome} />
      )}

      {view === "dashboard" && dashOrder && (
        <DashboardView initOrder={dashOrder} onBack={goHome} />
      )}

      {showFooter && (
        <div className="container" style={{ paddingBottom: 32 }}>
          <Footer />
        </div>
      )}
    </div>
  );
}
