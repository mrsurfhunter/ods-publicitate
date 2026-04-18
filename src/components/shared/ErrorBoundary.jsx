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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-triangle text-2xl text-[#e30613]"></i>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">A apărut o eroare</h2>
            <p className="text-slate-500 mb-6 text-sm">{this.state.error?.message}</p>
            <button
              className="px-6 py-3 bg-[#e30613] text-white font-bold rounded-xl hover:bg-red-700 transition-all"
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            >
              Reîncarcă pagina
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
