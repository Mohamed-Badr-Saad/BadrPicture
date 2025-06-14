import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import type { INavLink } from "@/types";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-queries/queriesAndMutations";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  if (isSuccess) {
    navigate("/sign-in");
  }
  const { user } = useUserContext();
  const { pathname } = useLocation();
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex items-center">
          <img src="/assets/images/BP-logo.svg" alt="logo" width={50} />
          <h1>Badr Pics</h1>
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-3">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
                //we added group property to use group-hover:invert-white
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={() => signOut()}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">Logout</p>
        </Button>
      </div>
    </nav>
  );
};

export default LeftSideBar;
