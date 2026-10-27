export const getWorkspaceHome = (role) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard-page";
    case "instructor":
      return "/instructor/instructor-dashboard-page";
    case "student":
      return "/user/learning-room";
    default:
      return "/home";
  }
};

export const getWorkspaceLabel = (role) =>
  role === "student" ? "My learning" : "Dashboard";

export const getSettingsPath = (role) => {
  switch (role) {
    case "admin":
      return "/admin/settings";
    case "instructor":
      return "/instructor/settings";
    case "student":
      return "/user/settings";
    default:
      return "/home";
  }
};
