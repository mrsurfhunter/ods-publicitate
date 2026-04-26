import { ODS } from "../../data/packages";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="text-[11px] text-white/40 uppercase tracking-[2px] font-bold">© 2026 {ODS.company} · Publicitate</div>
        <div className="flex gap-5 text-[11px] text-white/40 uppercase tracking-[2px] font-bold">
          <span>CIF {ODS.cif}</span>
          <span>{ODS.reg}</span>
          <span>{ODS.phone}</span>
        </div>
      </div>
    </footer>
  );
}
