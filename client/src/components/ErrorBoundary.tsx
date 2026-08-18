import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) console.error("[ErrorBoundary] Unhandled render error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary-fallback" role="alert" aria-live="assertive">
          <div>
            <AlertTriangle size={44} aria-hidden="true" />
            <p className="eyebrow"><span className="eyebrow-dot" /> CAFFIO / RECOVERY</p>
            <h1>We could not open this record.</h1>
            <p>Refresh to try again. No purchase, payment, or customer data has been created by this recovery screen.</p>
            <button type="button" onClick={() => window.location.reload()} className={cn("button", "button-gold")}>
              <RotateCcw size={16} aria-hidden="true" /> Reload page
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
