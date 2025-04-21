import { useLocation, useNavigate } from "react-router-dom";
import { SIDE_BAR_MENU } from "../../constants";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import MLogoutButton from "../mutation-buttons/MLogoutButton";

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
};

const navVariant = {
  initial: {
    translateX: "100%",
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  animate: {
    translateX: 0,
    opacity: 1,

    transition: {
      duration: 0.5,
    },
  },
};

const MobileNavModal = ({ isOpen, onClose }: PropsType) => {
  const location = useLocation();

  const isActive = (href: string) => {
    const currentPath = location.pathname + location.search;
    return currentPath === href;
  };

  const navigate = useNavigate();

  const handleNav = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <motion.div
      className="fixed h-screen left-0 top-0 w-full z-50 bg-[#000000e8] md:hidden"
      variants={navVariant}
      initial="initial"
      animate={isOpen ? "animate" : "initial"}
    >
      <div className="bg-neutral-800 h-full w-1/2 py-10 sm:w-5/12">
        <div className="flex flex-col gap-4 px-2">
          {SIDE_BAR_MENU.map((item) => (
            <div
              onClick={() => handleNav(item.href)}
              key={item.id}
              className={`flex items-center text-sm  lg:text-base hover:opacity-90 text-white hover:text-black hover:bg-white px-4 py-3 border-b rounded-md cursor-pointer ${
                isActive(item.href) && "text-black! bg-white"
              } `}
            >
              <p className="capitalize font-medium">{item.name}</p>
            </div>
          ))}
          <MLogoutButton isMobile />
        </div>
      </div>
      <Button
        className="absolute z-10 top-10 right-5 text-red-500 bg-neutral-200"
        size={"sm"}
        variant={"outline"}
        onClick={onClose}
      >
        Close
        <X />
      </Button>
    </motion.div>
  );
};

export default MobileNavModal;
