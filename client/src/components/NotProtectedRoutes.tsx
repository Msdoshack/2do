import { useSelector } from "react-redux";
import { selectUser } from "../redux/user/userSlice";
import { Navigate, Outlet } from "react-router-dom";

const NotProtectedRoutes = () => {
  const { user } = useSelector(selectUser);
  return user && user.token ? <Navigate to={"/dashboard"} /> : <Outlet />;
};

export default NotProtectedRoutes;
