import { useSelector } from "react-redux";

const useAuth = () => {
  const { user, isInitializing } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(user);

  return {
    isAuthenticated,
    user_type: user?.user_type,
    isInitializing,
  };
};

export default useAuth;
