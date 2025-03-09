"use client"
import { signIn } from "next-auth/react";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      {children}

      <div className="flex justify-center gap-2 p-4 bg-gray-100">
        {" "}
        {/* <button onClick={() => signIn("google")}>Sign in with Google</button> */}
      </div>
    </div>
  );
};

export default Layout;
