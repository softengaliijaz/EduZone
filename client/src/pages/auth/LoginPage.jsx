import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { login } from "../../features/auth/authSlice";
import AuthVisualPanel from "../../components/auth/AuthVisualPanel";
import { getWorkspaceHome } from "../../utils/roleNavigation";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(() =>
    Boolean(localStorage.getItem("rememberedEmail")),
  );
  const [email, setEmail] = useState(
    () => localStorage.getItem("rememberedEmail") || "",
  );
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!user) return;
    navigate(getWorkspaceHome(user.user_type), { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanEmail = email.trim();
    const errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = "Enter a valid email address.";
    }
    if (!password || password.length < 6) {
      errors.password = "Enter a password with at least 6 characters.";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    if (rememberEmail) localStorage.setItem("rememberedEmail", cleanEmail);
    else localStorage.removeItem("rememberedEmail");

    const result = await dispatch(login({ email: cleanEmail, password }));
    if (login.fulfilled.match(result)) {
      toast.success("You’re signed in. Welcome back.");
    } else {
      toast.error(
        result.payload ||
          "We couldn’t sign you in. Check your details and try again.",
      );
    }
  };

  return (
    <div className="auth-layout">
      <AuthVisualPanel mode="login" />
      <div className="auth-main">
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card__heading">
            <span className="auth-card__kicker">YOUR LEARNING SPACE</span>
            <h2 id="login-title">Welcome back</h2>
            <p>Sign in to continue where you left off.</p>
          </div>

          {error && (
            <div className="auth-alert" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="login-email">
                Email address
              </label>
              <div
                className={`auth-field${formErrors.email ? " auth-field--invalid" : ""}`}
              >
                <Mail
                  className="auth-field__icon"
                  size={18}
                  aria-hidden="true"
                />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFormErrors((current) => ({ ...current, email: "" }));
                  }}
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={
                    formErrors.email ? "login-email-error" : undefined
                  }
                />
              </div>
              {formErrors.email && (
                <p id="login-email-error" className="auth-field-error">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="auth-field-group">
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="login-password">
                  Password
                </label>
                <span className="auth-label-hint">Keep it private</span>
              </div>
              <div
                className={`auth-field${formErrors.password ? " auth-field--invalid" : ""}`}
              >
                <LockKeyhole
                  className="auth-field__icon"
                  size={18}
                  aria-hidden="true"
                />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFormErrors((current) => ({ ...current, password: "" }));
                  }}
                  aria-invalid={Boolean(formErrors.password)}
                  aria-describedby={
                    formErrors.password ? "login-password-error" : undefined
                  }
                />
                <button
                  className="auth-reveal"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && (
                <p id="login-password-error" className="auth-field-error">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="auth-options">
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(event) => setRememberEmail(event.target.checked)}
                />
                <span>Remember my email</span>
              </label>
              <Link className="auth-inline-link" to="/contact">
                Need help signing in?
              </Link>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" /> Signing
                  in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="auth-card__footer">
            <span>New to EduZone?</span>
            <Link to="/signup">Create your account</Link>
          </div>
          <p className="auth-privacy-note">
            <LockKeyhole size={13} aria-hidden="true" /> Your account details
            stay private and secure.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
