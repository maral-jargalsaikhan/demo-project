"use client";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { UserAuth } from "../contexts/AuthContext";
import { db } from "../firebase.config";
import ChartPie from "./ChartPie";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

const Page = () => {
  const { user, loading } = UserAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const data = query(collection(db, "items"));

    const unsubscribe = onSnapshot(data, (querySnapshot) => {
      let itemList = [];
      querySnapshot.forEach((doc) =>
        itemList.push({ ...doc.data(), id: doc.id })
      );

      setItems(itemList);
      setTotal(itemList.reduce((sum, item) => sum + parseFloat(item.price), 0));

      return () => unsubscribe();
    });
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : !user ? (
        <p>You must be logged in to view this page.</p>
      ) : (
        <div className="w-full">
          <h1 className="capitalize mb-5 flex gap-3 font-semibold">
            <UnorderedListOutlined />
            expense tracker
          </h1>
          <Divider />

          <ExpenseForm />
          <div className="w-full flex justify-between gap-10">
            <ExpenseList items={items} />

            <div className="w-[600px] mt-9">
              {items.length > 0 && (
                <div className="flex gap-2 font-semibold">
                  <span>Total</span>
                  <span>$ {total}</span>
                </div>
              )}
              <ChartPie items={items} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
