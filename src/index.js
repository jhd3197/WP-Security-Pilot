import { render } from '@wordpress/element';
import App from './App';

import './index.css';

const initialView = window?.samanSecuritySettings?.initialView || 'dashboard';

render(<App initialView={initialView} />, document.getElementById('saman-security-root'));
