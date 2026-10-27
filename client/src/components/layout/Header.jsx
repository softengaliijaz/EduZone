import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { logoutUser } from "../../features/auth/authSlice";
import useConfirmDialog from "../common/useConfirmDialog";
import { useTheme } from "../../contexts/ThemeContext";
import {
  getSettingsPath,
  getWorkspaceHome,
  getWorkspaceLabel,
} from "../../utils/roleNavigation";

const publicLinks = [
  ["/home", "Home"],
  ["/courses/courses-list", "Courses"],
  ["/view-all-blogs", "Articles"],
  ["/see-all-benefits", "Why EduZone"],
  ["/about", "About"],
];

const HeaderNav = ({ workspace = false, onMenuToggle, menuOpen = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const confirm = useConfirmDialog();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const authPage = ["/login", "/signup"].includes(location.pathname);
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const workspaceHome = getWorkspaceHome(user?.user_type);
  const workspaceLabel = getWorkspaceLabel(user?.user_type);
  const settingsPath = getSettingsPath(user?.user_type);

  useEffect(() => {
    setDropdownOpen(false);
    setPublicMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeMenus = (event) => {
      if (event.type === "keydown" && event.key === "Escape") {
        setDropdownOpen(false);
        setPublicMenuOpen(false);
        return;
      }
      if (event.type === "pointerdown" && !event.target.closest(".user-menu")) {
        setDropdownOpen(false);
      }
      if (
        event.type === "pointerdown" &&
        !event.target.closest(".public-mobile-menu, .mobile-public-toggle")
      ) {
        setPublicMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeMenus);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeMenus);
    };
  }, []);

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Sign out of EduZone?",
      message: "You will need to sign in again to return to your learning workspace.",
      confirmLabel: "Sign out",
      tone: "neutral",
    });
    if (!confirmed) return;
    setLoggingOut(true);
    try {
      const { serverLogoutSucceeded } = await dispatch(logoutUser()).unwrap();
      if (!serverLogoutSucceeded) {
        toast.error(
          "You were signed out on this device, but the server could not invalidate your session.",
        );
      }
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
      setDropdownOpen(false);
    }
  };

  return (
    <header className="topbar">
      <div className="flex min-w-0 items-center gap-3">
        {workspace && (
          <button
            type="button"
            className="icon-button mobile-nav-toggle"
            onClick={onMenuToggle}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="workspace-navigation"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        )}
        <Link
          className="topbar__brand"
          to={user ? workspaceHome : "/home"}
          aria-label={user ? `${workspaceLabel} — EduZone` : "EduZone home"}
        >
          <span className="topbar__mark" aria-hidden="true">
            EZ
          </span>
          <span className="topbar__brand-label">EduZone</span>
        </Link>
      </div>

      {!workspace && !authPage && (
        <nav className="topbar__links" aria-label="Main navigation">
          {user && (
            <Link
              className="topbar__link topbar__link--workspace"
              to={workspaceHome}
              aria-current={
                location.pathname === workspaceHome ? "page" : undefined
              }
            >
              {workspaceLabel}
            </Link>
          )}
          {publicLinks.map(([to, label]) => (
            <Link
              key={to}
              className="topbar__link"
              to={to}
              aria-current={location.pathname === to ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      <div className="topbar__actions">
        {!workspace && !authPage && (
          <button
            type="button"
            className="icon-button mobile-public-toggle"
            onClick={() => setPublicMenuOpen((open) => !open)}
            aria-label={publicMenuOpen ? "Close main menu" : "Open main menu"}
            aria-expanded={publicMenuOpen}
          >
            {publicMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        )}
        <button
          type="button"
          className="icon-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {user ? (
          <div className="user-menu">
            <button
              type="button"
              className="user-menu__trigger"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
            >
              <span className="user-menu__avatar" aria-hidden="true">
                {initial}
              </span>
              <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                {user.name || "Account"}
              </span>
              <ChevronDown size={15} aria-hidden="true" />
            </button>
            {dropdownOpen && (
              <div className="user-menu__popover" role="menu">
                <div className="border-b border-[var(--border)] px-3 py-2">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    {user.name || "Account"}
                  </p>
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    {user.email}
                  </p>
                </div>
                <Link
                  className="user-menu__item user-menu__item--workspace"
                  to={workspaceHome}
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  {workspaceLabel}
                </Link>
                <Link
                  className="user-menu__item"
                  to={settingsPath}
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings size={16} /> Profile and settings
                </Link>
                <button
                  className="user-menu__item"
                  type="button"
                  role="menuitem"
                  disabled={loggingOut}
                  onClick={handleLogout}
                >
                  <LogOut size={16} />{" "}
                  {loggingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            )}
          </div>
        ) : authPage ? (
          <Link className="topbar__link hidden sm:inline-flex" to="/home">
            Back to EduZone
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link className="topbar__link hidden sm:inline-flex" to="/login">
              Sign in
            </Link>
            <Link className="btn btn-primary btn-sm" to="/signup">
              Get started
            </Link>
          </div>
        )}
      </div>
      {publicMenuOpen && !workspace && !authPage && (
        <nav className="public-mobile-menu" aria-label="Main navigation">
          {user && (
            <Link
              to={workspaceHome}
              className="workspace-sidebar__link"
              onClick={() => setPublicMenuOpen(false)}
            >
              {workspaceLabel}
            </Link>
          )}
          {publicLinks.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="workspace-sidebar__link"
              onClick={() => setPublicMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/help"
            className="workspace-sidebar__link"
            onClick={() => setPublicMenuOpen(false)}
          >
            Help center
          </Link>
          <Link
            to="/contact"
            className="workspace-sidebar__link"
            onClick={() => setPublicMenuOpen(false)}
          >
            Contact
          </Link>
          {!user && (
            <Link
              to="/login"
              className="workspace-sidebar__link"
              onClick={() => setPublicMenuOpen(false)}
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default HeaderNav;
