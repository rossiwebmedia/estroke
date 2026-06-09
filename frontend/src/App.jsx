import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewEvaluation from './pages/NewEvaluation.jsx';
import Result from './pages/Result.jsx';
import Archive from './pages/Archive.jsx';
import Report from './pages/Report.jsx';
import PublicTriage from './pages/PublicTriage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/triage" element={<PublicTriage />} />
      <Route path="/evaluations/:id/report" element={<Report />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/evaluations/new" element={<NewEvaluation />} />
        <Route path="/evaluations/:id" element={<Result />} />
        <Route path="/archive" element={<Archive />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
