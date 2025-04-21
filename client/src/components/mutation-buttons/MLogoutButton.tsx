import { Power } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/user/userSlice";
import toast from "react-hot-toast";

const MLogoutButton = ({ isMobile }: { isMobile?: boolean }) => {
  const dispatch = useDispatch();

  const logoutFn = () => {
    dispatch(logoutUser());
    toast.success("logged out");
  };
  return (
    <Button
      title="logout"
      variant={isMobile ? "outline" : "default"}
      onClick={logoutFn}
    >
      <Power />
    </Button>
  );
};

export default MLogoutButton;
