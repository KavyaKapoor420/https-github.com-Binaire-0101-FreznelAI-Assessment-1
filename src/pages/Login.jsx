import { useState } from "react";
import { Button, TextField } from "@adobe/react-spectrum";
import { Link, useNavigate } from "react-router-dom";

function readableAuthError(error) {
  const messages = {
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
  };

  return messages[error?.code] || "Unable to sign in. Check your details and try again.";
}

function Login({ authService }) {
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
      .signIn(email, password)
      .then(() => navigate("/models"))
      .catch((signInError) => setError(readableAuthError(signInError)))
      .finally(() => setIsSubmitting(false));
  }

  return (
    <main className="min-h-screen bg-grid-light px-6 py-8 text-slate-950">
      <div className="mx-auto flex max-w-6xl justify-between">
        <Link className="text-lg font-semibold tracking-[-0.04em]" to="/">
          <span className="text-blue-600">●</span> binaire
        </Link>
        <Link className="text-sm text-slate-500 hover:text-blue-600" to="/signup">Create account</Link>
      </div>
      <section className="mx-auto flex max-w-md flex-col justify-center py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Welcome back</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em]">Continue exploring.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-500">Sign in to search your model workspace and access your cached data.</p>
        <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
          <TextField label="Email" type="email" value={email} onChange={setEmail} isRequired />
          <TextField label="Password" type="password" value={password} onChange={setPassword} isRequired />
          {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <Button type="submit" variant="accent" isDisabled={isSubmitting} width="full">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export default Login;
