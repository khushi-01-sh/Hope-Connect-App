import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  LogIn,
  UserPlus,
} from "lucide-react";

function Model({ show, onClose, orphanageId }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  if (!show) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isRegister && !name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMsg("");

    const demoAccounts = {
      "lokesh@gmail.com": "lokesh",
      "khushi@gmail.com": "khushi",
    };

    try {
      const res = await fetch("http://localhost:3200/adlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        setLoading(false);
        setMsg("Login Successful! Welcome back! 🎉");
        setMsgType("success");
        localStorage.removeItem("isDemoLoggedIn"); // Clear demo flag if real login works
        if (data.token) localStorage.setItem("token", data.token);
        setTimeout(() => {
          onClose();
          navigate(`/donate/${orphanageId || ""}`);
        }, 1000);
      } else {
        // Fallback for demo accounts if backend exists but doesn't have them
        if (demoAccounts[email] && demoAccounts[email] === password) {
          setLoading(false);
          setMsg("Demo Login Successful! Welcome! 🎉");
          setMsgType("success");
          localStorage.setItem("isDemoLoggedIn", "true");
          setTimeout(() => {
            onClose();
            navigate(`/donate/${orphanageId || "demo-001"}`);
          }, 1000);
        } else {
          setLoading(false);
          setMsg("Invalid email or password. Please try again.");
          setMsgType("error");
        }
      }
    } catch (err) {
      // Backend is down - use demo fallback
      if (demoAccounts[email] && demoAccounts[email] === password) {
        setTimeout(() => {
          setLoading(false);
          setMsg("Demo Login Successful! (Offline Mode) 🎉");
          setMsgType("success");
          localStorage.setItem("isDemoLoggedIn", "true");
          setTimeout(() => {
            onClose();
            navigate(`/donate/${orphanageId || "demo-001"}`);
          }, 1000);
        }, 500);
      } else {
        setLoading(false);
        setMsg("Connection error. Please check your internet connection.");
        setMsgType("error");
      }
    }
  };

  const autofill = (e, p) => {
    setEmail(e);
    setPassword(p);
    setMsg("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("http://localhost:3200/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setMsg("Registration successful! Please sign in to continue. 🎉");
        setMsgType("success");
        setIsRegister(false);
        // Clear form
        setName("");
        setPassword("");
      } else {
        setMsg(data.message || "Registration failed. Please try again.");
        setMsgType("error");
      }
    } catch (err) {
      setLoading(false);
      setMsg("Registration failed. Please check your connection.");
      setMsgType("error");
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      tabIndex="-1"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "420px" }}
      >
        <div
          className="modal-content border-0 shadow-lg"
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Header with Gradient */}
          <div
            className="text-center pt-5 pb-4 px-4 position-relative"
            style={{
              background: "linear-gradient(135deg, #0d7377 0%, #14919b 100%)",
              color: "#fff",
            }}
          >
            <button
              type="button"
              className="btn-close position-absolute top-3 end-3"
              style={{
                filter: "brightness(0) invert(1)",
                opacity: 0.8,
              }}
              onClick={onClose}
            ></button>

            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Heart size={24} fill="#fff" />
              </div>
            </div>
            <h4
              style={{
                fontFamily: "var(--hc-font-heading)",
                fontWeight: 700,
                fontSize: "1.5rem",
                marginBottom: "0.5rem",
              }}
            >
              {isRegister ? "Create Account" : "Welcome Back"}
            </h4>
            <p
              style={{
                opacity: 0.9,
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              {isRegister
                ? "Join our community and make a difference"
                : "Sign in to continue your donation journey"}
            </p>
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            {msg && (
              <div
                className="alert py-3 px-3 mb-4 d-flex align-items-center gap-2"
                style={{
                  background:
                    msgType === "error"
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(34,197,94,0.1)",
                  color: msgType === "error" ? "#dc2626" : "#16a34a",
                  border: `1px solid ${msgType === "error" ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {msgType === "error" ? (
                  <AlertCircle size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                <span>{msg}</span>
              </div>
            )}

            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              {isRegister && (
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold mb-2"
                    style={{
                      fontSize: "0.85rem",
                      color: "#334155",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Full Name
                  </label>
                  <div className="input-group">
                    <span
                      className="input-group-text border-0"
                      style={{
                        background: "#f1f5f9",
                        borderRadius: "12px 0 0 12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <User size={18} style={{ color: "#64748b" }} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      style={{
                        borderRadius: "0 12px 12px 0",
                        border: "1px solid #e2e8f0",
                        borderLeft: "none",
                        padding: "12px",
                        fontSize: "0.95rem",
                      }}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  {errors.name && (
                    <small
                      style={{
                        color: "#dc2626",
                        fontSize: "0.8rem",
                        marginTop: "4px",
                        display: "block",
                      }}
                    >
                      {errors.name}
                    </small>
                  )}
                </div>
              )}

              <div className="mb-3">
                <label
                  className="form-label fw-semibold mb-2"
                  style={{
                    fontSize: "0.85rem",
                    color: "#334155",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Email Address
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text border-0"
                    style={{
                      background: "#f1f5f9",
                      borderRadius: "12px 0 0 12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Mail size={18} style={{ color: "#64748b" }} />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    style={{
                      borderRadius: "0 12px 12px 0",
                      border: "1px solid #e2e8f0",
                      borderLeft: "none",
                      padding: "12px",
                      fontSize: "0.95rem",
                    }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {errors.email && (
                  <small
                    style={{
                      color: "#dc2626",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors.email}
                  </small>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="form-label fw-semibold mb-2"
                  style={{
                    fontSize: "0.85rem",
                    color: "#334155",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Password
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text border-0"
                    style={{
                      background: "#f1f5f9",
                      borderRadius: "12px 0 0 12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Lock size={18} style={{ color: "#64748b" }} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    style={{
                      borderRadius: "0 12px 12px 0",
                      border: "1px solid #e2e8f0",
                      borderLeft: "none",
                      padding: "12px",
                      fontSize: "0.95rem",
                    }}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                    }}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="btn border-0"
                    style={{
                      background: "#f1f5f9",
                      borderRadius: "0 12px 12px 0",
                      border: "1px solid #e2e8f0",
                      borderLeft: "none",
                      padding: "0 12px",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} style={{ color: "#64748b" }} />
                    ) : (
                      <Eye size={18} style={{ color: "#64748b" }} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <small
                    style={{
                      color: "#dc2626",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors.password}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-semibold"
                disabled={loading}
                style={{
                  padding: "14px",
                  fontSize: "1rem",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #0d7377 0%, #14919b 100%)",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? (
                  <span className="d-flex align-items-center justify-content-center gap-2">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></div>
                    {isRegister ? "Creating Account..." : "Signing In..."}
                  </span>
                ) : (
                  <span className="d-flex align-items-center justify-content-center gap-2">
                    {isRegister ? (
                      <>
                        <UserPlus size={18} />
                        Create Account
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        Sign In
                      </>
                    )}
                  </span>
                )}
              </button>
            </form>

            <div
              className="d-flex align-items-center my-4"
              style={{
                position: "relative",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "#e2e8f0",
                }}
              ></div>
              <span
                className="px-3"
                style={{
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  fontWeight: 500,
                }}
              >
                or
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "#e2e8f0",
                }}
              ></div>
            </div>

            <div className="text-center">
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.9rem",
                  margin: 0,
                }}
              >
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <span
                  style={{
                    color: "#0d7377",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(13, 115, 119, 0.3)",
                  }}
                  onClick={() => {
                    setMsg("");
                    setErrors({});
                    setIsRegister(!isRegister);
                  }}
                >
                  {isRegister ? "Sign In" : "Create Account"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Model;
