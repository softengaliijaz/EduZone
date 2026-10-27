import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound, LoaderCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { register } from "../../features/auth/authSlice";
import AuthVisualPanel from "../../components/auth/AuthVisualPanel";
import { getWorkspaceHome } from "../../utils/roleNavigation";

const getPasswordStrength = (password) => [
  password.length >= 8,
  /[A-Z]/.test(password),
  /[0-9]/.test(password),
  /[^A-Za-z0-9]/.test(password),
].filter(Boolean).length;

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    if (!user) return;
    navigate(getWorkspaceHome(user.user_type), { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const errors = {};
    if (cleanName.length < 2) errors.name = "Enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) errors.email = "Enter a valid email address.";
    if (password.length < 8) errors.password = "Use at least 8 characters for your password.";
    if (!confirmPassword) errors.confirmPassword = "Confirm your password.";
    else if (password !== confirmPassword) errors.confirmPassword = "Those passwords don’t match.";
    if (!agreedToTerms) errors.terms = "Please confirm before creating your account.";
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    const result = await dispatch(register({ name: cleanName, email: cleanEmail, password }));
    if (register.fulfilled.match(result)) {
      toast.success("Your account is ready. Welcome to EduZone.");
    } else {
      toast.error(result.payload || "We couldn’t create your account. Please try again.");
    }
  };

  const updateField = (field, value, setter) => {
    setter(value);
    setFormErrors((current) => ({ ...current, [field]: "" }));
  };

  return (
    <div className="auth-layout auth-layout--signup">
      <AuthVisualPanel mode="signup" />
      <div className="auth-main">
        <section className="auth-card auth-card--signup" aria-labelledby="signup-title">
          <div className="auth-card__heading">
            <span className="auth-card__kicker">START SOMETHING GOOD</span>
            <h2 id="signup-title">Create your account</h2>
            <p>A few details, then you’re ready to explore.</p>
          </div>

          {error && (
            <div className="auth-alert" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form auth-form--signup" onSubmit={handleSubmit} noValidate>
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="signup-name">Your name</label>
              <div className={`auth-field${formErrors.name ? " auth-field--invalid" : ""}`}>
                <UserRound className="auth-field__icon" size={18} aria-hidden="true" />
                <input id="signup-name" name="name" type="text" autoComplete="name" placeholder="How should we call you?" value={name} onChange={(event) => updateField("name", event.target.value, setName)} aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? "signup-name-error" : undefined} />
              </div>
              {formErrors.name && <p id="signup-name-error" className="auth-field-error">{formErrors.name}</p>}
            </div>

            <div className="auth-field-group">
              <label className="auth-label" htmlFor="signup-email">Email address</label>
              <div className={`auth-field${formErrors.email ? " auth-field--invalid" : ""}`}>
                <Mail className="auth-field__icon" size={18} aria-hidden="true" />
                <input id="signup-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" value={email} onChange={(event) => updateField("email", event.target.value, setEmail)} aria-invalid={Boolean(formErrors.email)} aria-describedby={formErrors.email ? "signup-email-error" : undefined} />
              </div>
              {formErrors.email && <p id="signup-email-error" className="auth-field-error">{formErrors.email}</p>}
            </div>

            <div className="auth-field-group">
              <label className="auth-label" htmlFor="signup-password">Create password</label>
              <div className={`auth-field${formErrors.password ? " auth-field--invalid" : ""}`}>
                <LockKeyhole className="auth-field__icon" size={18} aria-hidden="true" />
                <input id="signup-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => updateField("password", event.target.value, setPassword)} aria-invalid={Boolean(formErrors.password)} aria-describedby="password-guidance signup-password-strength" />
                <button className="auth-reveal" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              <div id="signup-password-strength" className="auth-strength" aria-live="polite">
                <div className="auth-strength__bars" aria-hidden="true">
                  {[1, 2, 3, 4].map((part) => <span className={part <= passwordStrength ? `is-active strength-${passwordStrength}` : ""} key={part} />)}
                </div>
                <span>{password ? ["Getting started", "Fair", "Good", "Strong"][Math.max(0, passwordStrength - 1)] : ""}</span>
              </div>
              <p className="auth-field-hint" id="password-guidance">Use 8+ characters. Adding a number or symbol makes it stronger.</p>
              {formErrors.password && <p className="auth-field-error">{formErrors.password}</p>}
            </div>

            <div className="auth-field-group">
              <label className="auth-label" htmlFor="signup-confirm-password">Confirm password</label>
              <div className={`auth-field${formErrors.confirmPassword ? " auth-field--invalid" : ""}`}>
                <LockKeyhole className="auth-field__icon" size={18} aria-hidden="true" />
                <input id="signup-confirm-password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter it once more" value={confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value, setConfirmPassword)} aria-invalid={Boolean(formErrors.confirmPassword)} aria-describedby={formErrors.confirmPassword ? "signup-confirm-error" : undefined} />
                <button className="auth-reveal" type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}>{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              {formErrors.confirmPassword && <p id="signup-confirm-error" className="auth-field-error">{formErrors.confirmPassword}</p>}
            </div>

            <div className="auth-consent-wrap">
              <label className="auth-check auth-check--terms">
                <input type="checkbox" checked={agreedToTerms} onChange={(event) => { setAgreedToTerms(event.target.checked); setFormErrors((current) => ({ ...current, terms: "" })); }} aria-invalid={Boolean(formErrors.terms)} aria-describedby={formErrors.terms ? "signup-terms-error" : undefined} />
                <span>I agree to EduZone’s terms and privacy practices.</span>
              </label>
              {formErrors.terms && <p id="signup-terms-error" className="auth-field-error">{formErrors.terms}</p>}
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? <><LoaderCircle size={18} className="animate-spin" /> Creating your account…</> : <>Create account <ArrowRight size={18} aria-hidden="true" /></>}
            </button>
          </form>

          <div className="auth-card__footer">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>
          <p className="auth-privacy-note"><Check size={14} aria-hidden="true" /> Your account is created securely with EduZone.</p>
        </section>
      </div>
    </div>
  );
};

export default SignUpPage;
