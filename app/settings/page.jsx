"use client";
import React from "react";
import { UserAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";
import { SettingOutlined } from "@ant-design/icons";

const Page = () => {
  const { loading, user } = UserAuth();

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : !user ? (
        <p>You must be logged in to view this page.</p>
      ) : (
        <h1 className="mb-5 ml-1 flex gap-3 font-semibold ">
          <SettingOutlined />
          Settings
        </h1>
      )}
    </div>
  );
};

export default Page;
