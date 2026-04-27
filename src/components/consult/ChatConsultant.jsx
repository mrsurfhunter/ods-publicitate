import { useState, useEffect, useRef } from "react";
import { callAI } from "../../utils/ai";
import { PKG } from "../../data/packages";

const SYSTEM_PROMPT = `Esti consultant media pentru Ora de Sibiu (oradesibiu.ro), cea mai citita publicatie din Sibiu.
Ajuta clientul sa aleaga pachetul potrivit punand intrebari pe rand (cate una):
1. Ce vrei sa promovezi?
2. Care e publicul tinta?
3. Ce te diferentiaza de concurenta?
4. Ai materiale (foto/video)?

Pachete disponibile: social-single (300 lei, 1 postare FB+IG), boost-express (450 lei, postare + boost Meta Ads), social-monthly (700 lei/luna, 4 postari + stories + Reel), articol-start (1200 lei/luna, articol 14 zile + social), business (1800 lei/luna, articol 30 zile + 6 postari + Reel, CEL MAI POPULAR), business-plus (2400 lei/luna, tot din business + push + newsletter + 8 postari + 2 Reels), premium (3500 lei/luna, tot + banner + 12 postari + manager dedicat), enterprise (5000 lei/luna, tot + Meta Ads + video + acoperire eveniment).

Add-ons: addon-banner (1200/luna), addon-push (300/trimitere), addon-newsletter (250/trimitere), addon-boost (400), addon-video (500/video), addon-event (800/eveniment).

Dupa ce ai suficiente informatii, recomanda un pachet specific mentionand ID-ul exact (ex: "social-monthly" sau "business").
Fii concis, profesional si prietenos. Raspunde in romana. Max 2-3 propozitii per mesaj.`;

export default function ChatConsultant({ onFinish }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Bună! Cu ce te ocupi și ce vrei să obții — mai mulți clienți, vizibilitate sau promovarea unui eveniment?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedPkg, setSuggestedPkg] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    const history = updated.map(m => `${m.role === "user" ? "Client" : "Consultant"}: ${m.text}`).join("\n");
    const response = await callAI(SYSTEM_PROMPT, history + "\nConsultant:");

    if (response) {
      setMessages(prev => [...prev, { role: "assistant", text: response }]);
      const pkgIds = PKG.map(p => p.id);
      for (const id of pkgIds) {
        if (response.toLowerCase().includes(id)) {
          setSuggestedPkg(id);
          break;
        }
      }
    } else {
      setMessages(prev => [...prev, { role: "assistant", text: "Am o eroare temporară. Putem încerca din nou?" }]);
    }
    setLoading(false);
  };

  const handleFinish = () => {
    if (suggestedPkg && onFinish) onFinish(suggestedPkg);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 animate-fadeIn">
      <div className="flex items-center gap-4 mb-6 bg-blue-50 p-4 border-2 border-blue-100">
        <div className="w-12 h-12 bg-blue-600 flex items-center justify-center text-white">
          <i className="fas fa-headset text-lg"></i>
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800 uppercase leading-none tracking-tight">Consultant Ora de Sibiu</h2>
          <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-widest">Recomandări personalizate</p>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 overflow-hidden flex flex-col h-[50vh] sm:h-[60vh] min-h-[300px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed ${
                m.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 border-2 border-slate-100"
              }`}>
                {m.text.split("\n").map((line, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-2" : ""}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 border-2 border-slate-100 flex gap-2">
                <div className="w-2 h-2 bg-brand animate-bounce"></div>
                <div className="w-2 h-2 bg-brand animate-bounce [animation-delay:100ms]"></div>
                <div className="w-2 h-2 bg-brand animate-bounce [animation-delay:200ms]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 bg-slate-50 border-2 border-slate-200 outline-none focus:border-slate-900 transition-all text-sm font-medium"
              placeholder="Scrie răspunsul tău aici..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="w-12 h-12 bg-brand text-white flex items-center justify-center hover:bg-brand-dark border-2 border-brand transition-all disabled:opacity-50"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>

      {suggestedPkg && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleFinish}
            className="group px-10 py-5 bg-slate-900 text-white font-black border-2 border-slate-700 hover:bg-black transition-all flex items-center gap-4"
          >
            <span className="uppercase text-xs tracking-widest">Vezi pachetul recomandat</span>
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
          <p className="text-[10px] text-slate-400">Poți schimba pachetul manual în pasul următor.</p>
        </div>
      )}
    </div>
  );
}
