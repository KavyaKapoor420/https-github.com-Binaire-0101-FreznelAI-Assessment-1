import { useEffect, useState } from "react";
import { Button } from "@adobe/react-spectrum";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AuthService from "./auth/AuthService.js";
import Login from "./pages/Login.jsx";
import Models from "./pages/Models.jsx";
import Signup from "./pages/Signup.jsx";

const authService = new AuthService();

function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  return (
    <main className={isDark ? "min-h-screen bg-[#09111d] text-slate-100" : "min-h-screen bg-[#fbfcfe] text-slate-950"}>
      <div className={isDark ? "min-h-screen bg-grid-dark" : "min-h-screen bg-grid-light"}>
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 lg:px-10">
          <Link className="text-lg font-semibold tracking-[-0.04em]" to="/">
            <span className="text-blue-600">●</span> binaire
          </Link>
          <div className="flex items-center gap-4">
            <Link className="hidden text-sm font-medium opacity-70 transition-opacity hover:opacity-100 sm:block" to="/models">
              Explore
            </Link>
            <Button variant="secondary" onPress={() => setIsDark((current) => !current)}>
              {isDark ? "Light" : "Dark"}
            </Button>
          </div>
        </nav>

        <section className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center lg:pt-28">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            A clearer way to discover AI models
          </div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Model discovery, simplified</p>
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl">
            Find the right model
            <span className="block text-slate-400">for the work ahead.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Search, compare, and understand available AI models through one calm, focused workspace built for better decisions.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="accent" onPress={() => navigate("/models")}>Explore models</Button>
            <Button variant="secondary" onPress={() => navigate("/login")}>Sign in to continue</Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-3 lg:px-10">
          {[
            ["01", "Search with intent", "Find models by name or family with fast, forgiving substring search."],
            ["02", "Compare the details", "See architecture, pipeline, weights, and file counts at a glance."],
            ["03", "Keep moving offline", "Your recent model data stays available when the connection does not."],
          ].map(([number, title, description]) => (
            <article className="border-t border-slate-200/80 bg-white/70 p-5 shadow-[0_12px_40px_rgba(30,55,90,0.05)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60" key={number}>
              <span className="text-xs font-semibold text-blue-600">{number}</span>
              <h2 className="mt-8 text-lg font-semibold tracking-[-0.03em]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function ProtectedModels({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Models user={user} authService={authService} />;
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribe((nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#fbfcfe] text-sm text-slate-500">Loading workspace...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/models" replace /> : <Login authService={authService} />} />
      <Route path="/signup" element={user ? <Navigate to="/models" replace /> : <Signup authService={authService} />} />
      <Route path="/models" element={<ProtectedModels user={user} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
