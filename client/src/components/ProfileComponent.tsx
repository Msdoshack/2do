import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import ChangePasswordModal from "./modals/ChangePasswordModal";
import TodoHeader from "./TodoHeader";
import { useGetUserQuery } from "../tanstack/mutation/user/mutation";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUser } from "../redux/user/userSlice";
import Loading from "./Loading";
import VerifyEmailModal from "./modals/VerifyEmailModal";
import avatar from "../assets/avatar.jpg";

const UserDetails = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex w-full gap-4">
      <p className="capitalize w-3/12">{title} :</p>
      <p className="capitalize"> {value}</p>
    </div>
  );
};

const ProfileComponent = () => {
  const { user } = useSelector(selectUser);

  const { data, isLoading, isError, error, isPending } = useGetUserQuery(
    user.user._id
  );
  const dispatch = useDispatch();

  const [showUpdateEmailModal, setShowUpdateEmailModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const onPasswordModalClose = () => {
    setShowChangePasswordModal(false);
  };
  const onClose = () => {
    setShowUpdateEmailModal(false);
  };

  useEffect(() => {
    if (isError) {
      if (error.status === 401) {
        dispatch(logoutUser());
        return;
      }
    }
  }, [isError, error]);

  if (isLoading || isPending) return <Loading />;
  return (
    <div className="text-black my-10 mx-4 md:mx-16 ">
      <TodoHeader title="Profile" />
      {data ? (
        <div className="flex flex-col items-center w-full gap-10 mt-10">
          <div>
            <div className="w-30 h-30 rounded-full overflow-hidden">
              <img src={avatar} className="h-full w-full bg-indigo-500" />
            </div>
            <h4 className="font-medium text-center capitalize text-lg text-orange-500">
              {data.data.username}
            </h4>
          </div>

          <div className="w-full flex flex-col items-center max-w-lg  border p-5 py-8 rounded-md gap-4">
            <UserDetails title="Username" value={data.data.username} />
            <UserDetails title="Email" value={data.data.email} />
          </div>

          <div className="w-full max-w-lg flex flex-col gap-4">
            <Button onClick={() => setShowUpdateEmailModal(true)}>
              Update Email
            </Button>

            <Button onClick={() => setShowChangePasswordModal(true)}>
              Change Password
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-red-500 text-lg h-[60vh] flex justify-center items-center">
          <p className="animate-pulse">Error Fetching Profile</p>
        </div>
      )}

      {showUpdateEmailModal && <VerifyEmailModal onClose={onClose} />}
      {showChangePasswordModal && (
        <ChangePasswordModal onClose={onPasswordModalClose} />
      )}
    </div>
  );
};

export default ProfileComponent;
