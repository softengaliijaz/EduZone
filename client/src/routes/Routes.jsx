import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getWorkspaceHome } from "../utils/roleNavigation";

// Layouts and Navigation
import HeaderNav from "../components/layout/Header";
import WorkspaceSidebar from "../components/layout/WorkspaceSidebar";

// Route screens are split into separate bundles so dashboard-only libraries are
// downloaded only when a user visits that workspace.
const HomePage = lazy(() => import("../pages/app/home/Home"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("../pages/auth/SignUpPage"));
const AboutUs = lazy(() => import("../components/app/about/AboutUs"));
const ContactUs = lazy(() => import("../components/app/contact/ContactUs"));
const CourseSuccess = lazy(() => import("../components/app/courses/CourseSuccess"));
const SeeAllCoursesList = lazy(() => import("../pages/app/courses/AllCourses"));
const CourseDetail = lazy(() => import("../pages/app/courses/CourseDetails"));
const ReadAllBlogs = lazy(() => import("../pages/app/blogs/AllBlogs"));
const Help = lazy(() => import("../pages/app/help/Help"));
const NotFound = lazy(() => import("../utils/NotFound"));
const SeeAllEduZoneBenefits = lazy(() => import("../components/app/home/AllBenefits"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const StudentsListPage = lazy(() => import("../pages/admin/students/StudentsList"));
const TeachersListPage = lazy(() => import("../pages/admin/instructors/Instructors"));
const CreateBlogPage = lazy(() => import("../pages/admin/blog/CreateBlog"));
const UpdateBlogPage = lazy(() => import("../pages/admin/blog/UpdateBlog"));
const DeleteBlogPage = lazy(() => import("../pages/admin/blog/DeleteBlog"));
const BlogListPage = lazy(() => import("../pages/admin/blog/BlogsList"));
const CreateCoursePage = lazy(() => import("../pages/admin/courses/CreateCourse"));
const UpdateCoursePage = lazy(() => import("../pages/admin/courses/UpdateCourse"));
const DeleteCoursePage = lazy(() => import("../pages/admin/courses/DeleteCourse"));
const CoursesListPage = lazy(() => import("../pages/admin/courses/CoursesList"));
const UserProfilePage = lazy(() => import("../components/admin/shared/UserProfilePage"));
const InstructorDashboard = lazy(() => import("../pages/instructor/Dashboard"));
const LearningRoom = lazy(() => import("../pages/app/learning-room/LearningRoom"));
const ContinueLearning = lazy(() => import("../components/app/learning-room/ContinueLearning"));

// Route Protection
import ProtectedRouteWrapper from "../routes/ProtectedRoutes";
import RoleProtectedRouteWrapper from "../routes/RoleProtectedRoutes";
const BlogsDetails = lazy(() => import("../pages/app/blogs/BlogsDetails"));
const AdminProfileSettings = lazy(() => import("../components/settings/AdminProfileSettings"));
const InstructorProfileSettings = lazy(() => import("../components/settings/InstructorProfileSettings"));
const StudentProfileSettings = lazy(() => import("../components/settings/StudentProfileSettings"));
const CertificateView = lazy(() => import("../components/common/Certificate"));
const CommunityView = lazy(() => import("../components/common/Community"));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
      </Suspense>
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const { isAuthenticated, user_type, isInitializing } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isWorkspace = ["/admin", "/instructor", "/user"].some((path) =>
    location.pathname.startsWith(path),
  );

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className={`app-frame${isWorkspace ? " app-frame--workspace" : ""}`}>
      <HeaderNav
        workspace={isWorkspace}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
      />
      {isWorkspace && (
        <WorkspaceSidebar
          role={user_type}
          open={menuOpen}
          onNavigate={() => setMenuOpen(false)}
        />
      )}
      <main className={`app-main ${isWorkspace ? "workspace-main" : "public-main"}`}>
      <Routes>
        <Route
          path="/"
          element={
            isInitializing ? (
              <div className="route-loading" role="status">Checking your account…</div>
            ) : (
              <Navigate to={isAuthenticated ? getWorkspaceHome(user_type) : "/home"} replace />
            )
          }
        />
        {/* Public Routes */}
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getWorkspaceHome(user_type)} replace />
            ) : isInitializing ? (
              <div className="route-loading" role="status">Checking your account…</div>
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to={getWorkspaceHome(user_type)} replace />
            ) : isInitializing ? (
              <div className="route-loading" role="status">Checking your account…</div>
            ) : (
              <SignUpPage />
            )
          }
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/courses/courses-list" element={<SeeAllCoursesList />} />
        <Route path="/see-all-benefits" element={<SeeAllEduZoneBenefits />} />
        <Route path="/help" element={<Help />} />
        <Route path="/view-all-blogs" element={<ReadAllBlogs />} />
        <Route path="/view-blog-details/:id" element={<BlogsDetails />} />
        <Route
          path="/courses/course-details/course/:id"
          element={<CourseDetail />}
        />
        <Route path="/course-purchase-status" element={<CourseSuccess />} />

        {/* Protected Routes */}
        <Route path="/contact" element={<ContactUs />} />

        <Route element={<ProtectedRouteWrapper />}>

          {/* Admin Only */}
          <Route
            element={<RoleProtectedRouteWrapper allowedRoles={["admin"]} />}
          >
            <Route path="/admin/dashboard-page" element={<AdminDashboard />} />
            <Route
              path="/admin/get-all-students"
              element={<StudentsListPage />}
            />
            <Route path="/admin/students/:id" element={<UserProfilePage />} />
            <Route
              path="/admin/get-all-instructors"
              element={<TeachersListPage />}
            />
            <Route
              path="/admin/instructors/:id"
              element={<UserProfilePage />}
            />
            <Route
              path="/admin/blog/get-all-blogs"
              element={<BlogListPage />}
            />
            <Route path="/admin/blog/add-blog" element={<CreateBlogPage />} />
            <Route
              path="/admin/blog/update-blog/:id"
              element={<UpdateBlogPage />}
            />
            <Route
              path="/admin/blog/delete-blog/:id"
              element={<DeleteBlogPage />}
            />

            <Route path="/admin/settings" element={<AdminProfileSettings />} />
          </Route>

          {/* Instructor Only */}
          <Route
            element={
              <RoleProtectedRouteWrapper allowedRoles={["instructor"]} />
            }
          >
            <Route
              path="/instructor/instructor-dashboard-page"
              element={<InstructorDashboard />}
            />

            <Route
              path="/instructor/settings"
              element={<InstructorProfileSettings />}
            />
          </Route>

          {/* Shared Admin + Instructor Routes */}
          <Route
            element={
              <RoleProtectedRouteWrapper
                allowedRoles={["admin", "instructor"]}
              />
            }
          >
            {/* Admin */}
            <Route
              path="/admin/courses-management/get-all-courses"
              element={<CoursesListPage />}
            />
            <Route
              path="/admin/courses-management/create-course"
              element={<CreateCoursePage />}
            />
            <Route
              path="/admin/courses-management/update-course/:id"
              element={<UpdateCoursePage />}
            />
            <Route
              path="/admin/courses-management/course/:id"
              element={<CourseDetail workspace managementView />}
            />
            <Route
              path="/admin/courses-management/delete-course"
              element={<DeleteCoursePage />}
            />

            {/* Instructor */}
            <Route
              path="/instructor/courses-management/get-all-courses"
              element={<CoursesListPage />}
            />
            <Route
              path="/instructor/courses-management/create-course"
              element={<CreateCoursePage />}
            />
            <Route
              path="/instructor/courses-management/update-course/:id"
              element={<UpdateCoursePage />}
            />
            <Route
              path="/instructor/courses-management/course/:id"
              element={<CourseDetail workspace managementView />}
            />
            <Route
              path="/instructor/courses-management/delete-course"
              element={<DeleteCoursePage />}
            />
          </Route>

          {/* Student Only */}
          <Route
            element={<RoleProtectedRouteWrapper allowedRoles={["student"]} />}
          >
            <Route path="/user/learning-room" element={<LearningRoom />} />
            <Route path="/user/explore-courses" element={<SeeAllCoursesList workspace />} />
            <Route path="/user/courses/:id" element={<CourseDetail workspace />} />
            <Route
              path="/user/continue-learning"
              element={<ContinueLearning />}
            />
            <Route path="/user/settings" element={<StudentProfileSettings />} />
            <Route path="/user/certificates" element={<CertificateView />} />
            <Route path="/user/community" element={<CommunityView />} />
          </Route>
        </Route>

        {/* Not Found */}
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/notfound" replace />} />
      </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;
