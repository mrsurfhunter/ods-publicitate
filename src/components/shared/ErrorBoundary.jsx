import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: 500, margin: "80px auto", padding: 32, textAlign: "center",
          background: "var(--c-card)", borderRadius: "var(--radius)", border: "1px solid var(--c-border)",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>!</div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 800, color: "var(--c-primary)", marginBottom: 8 }}>
            A apărut o eroare
          </h2>
          <p style={{ fontSize: 14, color: "var(--c-muted)", marginBottom: 20 }}>
            Ne cerem scuze. Reîncărcați pagina pentru a continua.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
          >
            Reîncarcă pagina
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
