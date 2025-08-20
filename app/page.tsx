"use client";

import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const ok = res.ok;
      setStatus(ok ? "Check your email to confirm." : "Subscription failed.");
      if (ok) {
        setSubmitted(true);
      }
    } catch {
      setStatus("Subscription failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-2 text-center">Newsletter for lucasfcosta.com</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">Get updates from Lucas da Costa’s blog at <a href="https://lucasfcosta.com" className="underline" target="_blank" rel="noreferrer">lucasfcosta.com</a>.</p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitted}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 disabled:bg-gray-100 disabled:text-gray-500"
          />
          <button
            type="submit"
            disabled={loading || submitted}
            className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {submitted ? "Email sent" : loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {status && <p className="mt-3 text-center text-sm text-gray-700">{status}</p>}
      </div>
    </main>
  );
}


