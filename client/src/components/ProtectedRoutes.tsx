import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { selectUser } from "../redux/user/userSlice";

const ProtectedRoutes = () => {
  const location = useLocation();

  const { user } = useSelector(selectUser);

  return user && user?.token ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
