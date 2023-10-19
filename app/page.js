"use client";
import React from "react";
import { UserAuth } from "./contexts/AuthContext";
import Spinner from "./components/Spinner";
import { HomeOutlined } from "@ant-design/icons";
import { Divider } from "antd";

export default function Home() {
  const { loading } = UserAuth();

  return (
    <main>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className="mb-5 ml-1 flex gap-3 font-semibold ">
            <HomeOutlined />
            Overview
          </h1>
          <Divider />
        </>
      )}
    </main>
  );
}
