import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// If anything crashes, show the error on the page instead of a blank screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="crash">
        <h1>Unique Traveler hit a snag</h1>
        <p>Send this message to whoever's fixing it:</p>
        <pre>{String(this.state.error?.stack || this.state.error)}</pre>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);