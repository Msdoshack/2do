import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import MobileNavModal from "./modals/MobileNavModal";

const MobileNav = () => {
  const [showMobileNavModal, setShowMobileNavModal] = useState(false);

  const onClose = () => {
    setShowMobileNavModal(false);
  };
  return (
    <div className="md:hidden">
      <Button variant={"outline"} onClick={() => setShowMobileNavModal(true)}>
        <MenuIcon />
      </Button>

      <MobileNavModal isOpen={showMobileNavModal} onClose={onClose} />
    </div>
  );
};

export default MobileNav;
