import React from 'react';
import { createRoot } from 'react-dom/client';

import Options from './Options';
import './options.css';

const container = document.getElementById('app-container');
const root = createRoot(container as HTMLElement); // createRoot(container!) if you use TypeScript
root.render(<Options/>);
