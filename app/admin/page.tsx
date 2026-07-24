"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/iam/actions";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await loginAction(formData);

      if (result.success) {
        router.push("/admin/dashboard");
      } else {
        setError(result.error || "Invalid Credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fafaf8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 2rem",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#9a9690", margin: "0 0 1rem" }}>
          TEZHHOMAYAA
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.75rem", letterSpacing: "0.02em" }}>
          Admin Login
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#ffffff",
          border: "1px solid #e8e4df",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {error && (
          <div style={{
            background: "#fdf0f0",
            border: "1px solid #e0b8b8",
            padding: "1rem",
            color: "#6b3a3a",
            fontSize: "0.85rem",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="email" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>
            Email or Username
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              padding: "0.85rem",
              border: "1px solid #ccc9c4",
              background: "transparent",
              fontSize: "0.95rem",
              color: "#1a1a18",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="password" style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{
              padding: "0.85rem",
              border: "1px solid #ccc9c4",
              background: "transparent",
              fontSize: "0.95rem",
              color: "#1a1a18",
              outline: "none",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#1a1a18",
            color: "#f7f5f2",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            transition: "background 0.3s",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
