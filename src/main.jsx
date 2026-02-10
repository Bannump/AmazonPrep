import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = ReactDOM.createRoot(rootElement);

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return React.createElement('div', {
          style: { padding: '2rem', color: '#ff0000', backgroundColor: '#ffffff' }
        }, 'Error: ', this.state.error?.toString());
      }
      return this.props.children;
    }
  }

  root.render(
    React.createElement(ErrorBoundary, null,
      React.createElement(AuthProvider, null,
        React.createElement(App, null)
      )
    )
  );
} catch (error) {
  console.error('Error mounting app:', error);
}
