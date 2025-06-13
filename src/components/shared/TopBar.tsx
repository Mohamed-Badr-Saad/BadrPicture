import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-queries/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const {user} = useUserContext();
  useEffect(() => {
    if (isSuccess) {
      navigate(0); //navigate to sign-in or sign-up page
    }
  }, [isSuccess]);
  return (
    <section className="topbar">
      <div className="flex-between px-5 py-4">
        <Link to="/" className="flex gap-1 items-center">
          <img src="/assets/images/BP-logo.svg" alt="logo" width={50} />
          <h1 className="text-2xl font-bold">Badr Pics</h1>
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>

          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/images/default-avatar.png"}
              alt="profile" className="rounded-full h-8 w-8"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
