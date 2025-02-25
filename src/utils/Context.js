"use client";
import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedUser = Cookies.get("u-user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      Cookies.set("u-user", JSON.stringify(user), { expires: 7 });
    }
  }, [user, isClient]);

  const logout = () => {
    setUser(null);
  };

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
