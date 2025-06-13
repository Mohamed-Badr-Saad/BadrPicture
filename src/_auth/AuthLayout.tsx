import { Outlet, Navigate } from "react-router-dom";
const AuthLayout = () => {
  const isAuthenticated: boolean = false; // Replace with your authentication logic

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" /> //navigate to home page if authenticated
      ) : (
        <>
          <section className="flex flex-col justify-center items-center flex-1 py-10">
            <Outlet />
            {/**Outlet is a placeholder for the child routes */}
          </section>
          <img src="assets/images/side-img.svg" alt="logo"
          className="hidden xl:block object-cover h-screen w-1/2 bg-no-repeat" />
        </>
      )}
    </>
  );
};

export default AuthLayout;
