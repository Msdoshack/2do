import { Link, useLocation } from "react-router-dom";
import { SIDE_BAR_MENU } from "../constants";

const SideMenu = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    const currentPath = location.pathname + location.search;

    return currentPath === href;
  };

  return (
    <div className="w-1/5 bg-neutral-800 sticky top-0 h-screen overflow-y-scroll px-1 py-8 hidden md:block">
      <div className="flex flex-col gap-4">
        {SIDE_BAR_MENU.map((item) => (
          <Link
            key={item.id}
            to={`${item.href}`}
            className={`flex items-center text-sm  lg:text-base hover:opacity-90 text-white hover:text-black hover:bg-white px-4 py-3 border-b rounded-md ${
              isActive(item.href) && "text-black! bg-white"
            } `}
          >
            <p className="capitalize font-medium">{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
