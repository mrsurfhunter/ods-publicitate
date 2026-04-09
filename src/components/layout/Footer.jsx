import { ODS } from "../../data/packages";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-badges">
        <span>17 ani experienta</span>
        <span style={{ color: 'var(--c-border)' }}>|</span>
        <span>Trafic auditat BRAT</span>
        <span style={{ color: 'var(--c-border)' }}>|</span>
        <span>400.000+ vizitatori/luna</span>
      </div>
      <a href="https://www.brat.ro/sati/site/oradesibiu-ro/trafic-total/trafic-total" target="_blank" rel="noopener" className="btn btn-dark btn-sm">
        Verificare BRAT
      </a>
      <div className="footer-company">{ODS.company} | CIF {ODS.cif} | {ODS.reg} | {ODS.phone}</div>
    </div>
  );
}
