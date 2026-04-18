import { ODS } from "../../data/packages";

export default function Footer() {
  return (
    <footer className="mt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-slate-200 pt-8 flex flex-col items-center gap-4 text-center">
          <img
            src="https://cdn.oradesibiu.ro/wp-content/uploads/2023/01/odsalbAsset-1.png"
            alt="Ora de Sibiu"
            className="h-6 opacity-30 grayscale"
          />
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>17 ani experiență</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full flex-shrink-0"></span>
            <span>Trafic BRAT</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full flex-shrink-0"></span>
            <span>400k+ vizitatori/lună</span>
          </div>
          <a
            href="https://www.brat.ro/sati/site/oradesibiu-ro/trafic-total/trafic-total"
            target="_blank"
            rel="noopener"
            className="text-[10px] font-black text-[#e30613] uppercase tracking-widest hover:underline"
          >
            Verificare BRAT →
          </a>
          <div className="text-[10px] text-slate-400 mt-2">
            © 2026 {ODS.company} | CIF {ODS.cif} | {ODS.reg} | {ODS.phone}
          </div>
        </div>
      </div>
    </footer>
  );
}
