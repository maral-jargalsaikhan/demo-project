"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../contexts/AuthContext";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { Button, Empty, Input } from "antd";
import {
  EditOutlined,
  DollarOutlined,
  CloseOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Spinner from "../components/Spinner";

const Page = () => {
  const { loading, user } = UserAuth();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [total, setTotal] = useState(0);

  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.price !== "") {
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        price: newItem.price,
      });
      setNewItem({ name: "", price: "" });
    }
  };

  // READ ITEMS FROM DB
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemList = [];

      querySnapshot.forEach((doc) =>
        itemList.push({ ...doc.data(), id: doc.id })
      );
      setItems(itemList);

      const calculateTotal = () => {
        const totalPrice = itemList.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  // DELETE ITEM FROM DB
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  const btnProps = {
    className: "flex justify-center items-center text-neutral-500",
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : !user ? (
        <p>You must be logged in to view this page.</p>
      ) : (
        <div className="w-[600px]">
          <h1 className="mb-5 ml-1 flex gap-3 font-semibold">
            <UnorderedListOutlined />
            Expence tracker
          </h1>
          <form className="grid grid-cols-6 gap-2 ">
            <Input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              prefix={<EditOutlined />}
              placeholder="enter item"
              className="col-span-3"
            />
            <Input
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              prefix={<DollarOutlined />}
              placeholder="enter price"
              className="col-span-2"
            />
            <Button onClick={addItem} {...btnProps}>
              <PlusOutlined />
            </Button>
          </form>

          <ul className="flex flex-col gap-2 mt-3 p-5 border-neutral-200 border-[1px] rounded-lg text-sm">
            {items && items.length > 0 ? (
              items.map((item, id) => (
                <li
                  key={id}
                  className="flex justify-between items-center w-full"
                >
                  <div className="flex w-full justify-between pr-5 mx-5 border-r-2 border-neutral-200 ">
                    <span className="capitalize">{item.name}</span>
                    <span>$ {item.price}</span>
                  </div>
                  <Button onClick={() => deleteItem(item.id)} {...btnProps}>
                    <CloseOutlined />
                  </Button>
                </li>
              ))
            ) : (
              <div className="flex items-center justify-center min-h-[300px]">
                <Empty />
              </div>
            )}
          </ul>

          {items.length < 1 ? (
            ""
          ) : (
            <div className="flex gap-2 my-5 px-2 font-semibold">
              <span>Total</span>
              <span>$ {total}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
