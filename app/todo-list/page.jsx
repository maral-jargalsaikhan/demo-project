"use client";
import React from "react";
import { UserAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Divider } from "antd";

const Page = () => {
  const { loading, user } = UserAuth();

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : !user ? (
        <p>You must be logged in to view this page.</p>
      ) : (
        <div className="w-full">
          <h1 className="mb-5 ml-1 flex gap-3 font-semibold ">
            <UnorderedListOutlined />
            Todo List
          </h1>
          <Divider />
        </div>
      )}
    </div>
  );
};

export default Page;
