import Link from "next/link";
import React from "react";
import { Button } from "antd";
import { FiLogOut } from "react-icons/fi";
import {
  HomeOutlined,
  UnorderedListOutlined,
  VideoCameraOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { UserAuth } from "../contexts/AuthContext";

const btnProps = {
  className: "flex items-center p-3",
  style: { height: 40, width: 150 },
};

const navLinks = [
  {
    icon: <HomeOutlined />,
    title: "Overview",
    href: "/",
  },
  {
    icon: <VideoCameraOutlined />,
    title: "LMS",
    href: "/lms",
  },
  {
    icon: <UnorderedListOutlined />,
    title: "Expense tracker",
    href: "/expense-tracker",
  },
  {
    icon: <SettingOutlined />,
    title: "Settings",
    href: "/settings",
  },
];

const Sidebar = () => {
  const { user, logOut } = UserAuth();

  const logOutHandler = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error on log out handler:", error);
    }
  };

  return (
    <div className="flex fixed">
      <div className="h-screen px-5 py-8 bg-white border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center h-full justify-between ">
          <ul className="flex flex-col gap-5">
            {navLinks.map((navItem, index) => (
              <Link key={index} href={navItem.href}>
                <Button {...btnProps} type="default" icon={navItem.icon}>
                  {navItem.title}
                </Button>
              </Link>
            ))}
          </ul>

          {user ? (
            <Button
              className="flex text-neutral-500 justify-center items-center"
              type="default"
              icon={<FiLogOut />}
              onClick={logOutHandler}
            >
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
