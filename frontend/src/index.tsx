import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./AppRoutes"


const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
