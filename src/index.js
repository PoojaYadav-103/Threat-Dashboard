import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import { createRoot } from 'react-dom/client';
import { App } from './components/stateful/Containers';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
