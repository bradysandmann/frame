import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import AppShell from './pages/AppShell';
import Dashboard from './pages/Dashboard';
import WidgetDetail from './pages/WidgetDetail';
import ConversationDetail from './pages/ConversationDetail';
import TestWidget from './pages/TestWidget';
import NotFound from './pages/NotFound';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="widgets/:id" element={<WidgetDetail />} />
          <Route path="conversations/:id" element={<ConversationDetail />} />
          <Route path="test/:id" element={<TestWidget />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
