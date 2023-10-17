import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase.config";

const DemoPie = () => {
  const [items, setItems] = useState([]);

  const data = [
    { type: "Housing", value: "" },
    { type: "Transportation", value: "" },
    { type: "Food", value: "" },
    { type: "Utilities", value: "" },
    { type: "Insurance", value: "" },
    { type: "Healthcare", value: "" },
    { type: "Debt Payments", value: "" },
    { type: "Personal Spending", value: "" },
    { type: "Entertainment", value: "" },
    { type: "Miscellaneous", value: "" },
  ];

  const sumCount = (category, price) => {
    data.type === category && { ...data, value: value + price };
  };

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
    },
    interactions: [{ type: "element-active" }],
  };

  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemList = [];

      querySnapshot.forEach((doc) =>
        itemList.push({ ...doc.data(), id: doc.id })
      );
      setItems(itemList);
      console.log("items: ", itemList);

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
    <div className="w-[600px]">
      <Pie {...config} />

      {items.map((item) => item && sumCount(item.category, item.price))}
    </div>
  );
};

export default DemoPie;
