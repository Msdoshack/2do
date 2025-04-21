import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/user/userSlice";

import MobileNav from "./MobileNav";

import MLogoutButton from "./mutation-buttons/MLogoutButton";

const Navbar = () => {
  const { user } = useSelector(selectUser);

  return (
    <div className="flex items-center justify-between p-4 shadow-2xl bg-neutral-100 z-50">
      <div className="">
        <Link to={"/"}>
           <h1 className="font-extrabold text-2xl"> ⏰2DO</h1>
        </Link>
      </div>

      {user && user?.user ? (
        <div>
          <div className="hidden md:block">
            <MLogoutButton />
          </div>

          <MobileNav />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to={"/sign-in"}>
            <Button
              size={"sm"}
              className="hover:bg-white hover:text-black ring-1"
            >
              Login
            </Button>
          </Link>
          {/* 
          <Link to={"sign-up"}>
            <Button
              size={"sm"}
              className="hover:bg-white hover:text-black ring-1"
            >
              Sign-Up
            </Button>{" "}
          </Link> */}
        </div>
      )}
    </div>
  );
};

export default Navbar;
