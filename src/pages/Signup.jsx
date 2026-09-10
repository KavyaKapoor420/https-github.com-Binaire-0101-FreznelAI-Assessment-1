import { useState } from "react";
import { Button, TextField } from "@adobe/react-spectrum";
import { Link, useNavigate } from "react-router-dom";

function readableAuthError(error) {
  const messages = {
    "auth/email-already-in-use": "An account already exists for this email.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/weak-password": "Use a stronger password with at least six characters.",
    "auth/operation-not-allowed": "Email and password sign-in is disabled in Firebase Authentication.",
    "auth/configuration-not-found": "Firebase is not configured for this app yet. Enable Email/Password in Firebase Authentication, then restart Vite.",
  };

  return messages[error?.code] || "Unable to create your account. Please try again.";
}

function Signup({ authService }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    authService
      .signUp(email, password)
      .then(() => navigate("/models"))
      .catch((signUpError) => setError(readableAuthError(signUpError)))
      .finally(() => setIsSubmitting(false));
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-6 py-8 text-slate-950">
      <div className="mx-auto flex max-w-6xl justify-between">
        <Link className="text-lg font-semibold tracking-[-0.04em]" to="/">
          <span className="text-blue-600">●</span> binaire
        </Link>
        <Link className="text-sm text-slate-500 hover:text-blue-600" to="/login">Sign in</Link>
      </div>
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(35,55,85,0.1)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[#0d3b66] p-12 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Start focused</p>
          <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-[-0.06em]">A calmer way to choose your next model.</h1>
          <p className="mt-6 text-sm leading-7 text-blue-100/75">Save your discovery workspace, compare technical details, and keep cached models available when the network changes.</p>
          <div className="mt-16 border-t border-white/15 pt-5 text-sm text-blue-100/70">Search less. Understand more.</div>
        </div>
        <div className="p-7 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 lg:hidden">Start focused</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] lg:mt-0">Create your workspace.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-500">Use your email to save access to the model discovery workspace.</p>
          <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
            <TextField label="Email" type="email" value={email} onChange={setEmail} isRequired />
            <TextField label="Password" type="password" value={password} onChange={setPassword} isRequired />
            {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{error}</p>}
            <Button type="submit" variant="accent" isDisabled={isSubmitting} width="full">
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Signup;
