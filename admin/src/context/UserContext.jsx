import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const getUser = () => {
    if (!token) return;

    fetch("https://air-pax.onrender.com/api/v1/user/me", {
      method: "GET",
      headers: {
        token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status==="success") {
          setUser(data?.user);
        }else{
          localStorage.removeItem("token")
        }
      })
      .catch((err) => {
        console.log("profile Error", err);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, getUser, token, handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};
