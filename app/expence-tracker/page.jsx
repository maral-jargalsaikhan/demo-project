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
import {
  Button,
  Empty,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
  Tag,
} from "antd";
import {
  EditOutlined,
  DollarOutlined,
  CloseOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Spinner from "../components/Spinner";
import DemoPie from "./Chart";

const tagColor = (category) => {
  switch (category) {
    case "Housing":
      return "processing";
    case "Transportation":
      return "success";
    case "Food":
      return "error";
    case "Utilities":
      return "warning";
    case "Insurance":
      return "magenta";
    case "Healthcare":
      return "red";
    case "Debt Payments":
      return "volcano";
    case "Personal Spending":
      return "lime";
    case "Entertaiment":
      return "green";
    case "Miscellaneous":
      return "cyan";
    default:
      return "";
  }
};

const categories = [
  { label: "Housing", value: "Housing" },
  { label: "Transportation", value: "Transportation" },
  { label: "Food", value: "Food" },
  { label: "Utilities", value: "Utilities" },
  { label: "Insurance", value: "Insurance" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Debt Payments", value: "Debt Payments" },
  { label: "Personal Spending", value: "Personal Spending" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Miscellaneous", value: "Miscellaneous" },
];

// DELETE ITEM FROM DB
const deleteItem = async (id) => {
  await deleteDoc(doc(db, "items", id));
};
const btnProps = {
  className: "flex justify-center items-center text-neutral-500",
};

// const columns = [
//   { title: "Item", dataIndex: "name", key: "item" },
//   { title: "Price", dataIndex: "price", key: "price" },
//   {
//     title: "Category",
//     dataIndex: "category",
//     key: "category",
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//     key: "action",
//     render: (item) => (
//       <Popconfirm
//         title="Delete the item"
//         description="Are you sure delete this item?"
//         onConfirm={() => [
//           message.success("Successfully deleted"),
//           deleteItem(item.id),
//         ]}
//         onCancel={(e) => message.error("Clicked on Cancel")}
//       >
//         <Button danger className="flex justify-center items-center w-[30px]">
//           <CloseOutlined />
//         </Button>
//       </Popconfirm>
//     ),
//   },
// ];

const Page = () => {
  const { loading, user } = UserAuth();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });
  const [total, setTotal] = useState(0);

  const addItem = async (e) => {
    e.preventDefault();
    if (
      newItem.name !== "" &&
      newItem.price !== "" &&
      newItem.category !== ""
    ) {
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        price: newItem.price,
        category: newItem.category,
      });
      setNewItem({ name: "", price: "", category: "" });
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

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : !user ? (
        <p>You must be logged in to view this page.</p>
      ) : (
        <div className="w-full">
          <h1 className="mb-5 ml-1 flex gap-3 font-semibold">
            <UnorderedListOutlined />
            Expence tracker
          </h1>

          <div className="w-full flex justify-between gap-10">
            <div className="">
              <form className="grid grid-cols-8 gap-2 ">
                <Input
                  type="text"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
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
                <Select
                  placeholder="Category"
                  optionFilterProp="children"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e })}
                  options={categories}
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
                      className=" items-center w-full grid grid-cols-8 gap-2 "
                    >
                      <div className="flex w-full justify-between pr-10 col-span-5">
                        <span className="capitalize">{item.name}</span>
                        <span>$ {item.price}</span>
                      </div>
                      <div className="w-[200px] flex justify-center col-span-2">
                        <Tag color={tagColor(item.category)}>
                          {item.category}
                        </Tag>
                      </div>

                      <Popconfirm
                        title="Delete the item"
                        className="ml-[50px]"
                        description="Are you sure delete this item?"
                        onConfirm={() => [
                          message.success("Successfully deleted"),
                          deleteItem(item.id),
                        ]}
                        onCancel={(e) => message.error("Clicked on Cancel")}
                      >
                        <Button
                          danger
                          className="flex justify-center items-center w-[30px]"
                        >
                          <CloseOutlined />
                        </Button>
                      </Popconfirm>
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

            {/* CHART */}
            <DemoPie />
          </div>

          {/* <Table className="mt-5" columns={columns} dataSource={items} /> */}
        </div>
      )}
    </div>
  );
};

export default Page;
