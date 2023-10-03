import React from "react";
import { UserAuth } from "../contexts/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { Button } from "antd";
import Login from "./Login";

const Header = () => {
  const { user } = UserAuth();

  return (
    <div className="w-full flex justify-between items-center h-20 px-2">
      <h2 className="flex items-center text-md">Demo for Adaption 🫣</h2>

      {!user ? <Login /> : <p>Hello 👋, {user.displayName}</p>}
    </div>
  );
};

export default Header;
