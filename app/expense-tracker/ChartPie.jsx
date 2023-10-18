import React, { useState } from "react";
import { Pie } from "@ant-design/plots";

const categoryOptions = [
  { type: "Food", value: 0 },
  { type: "Insurance", value: 0 },
  { type: "Healthcare", value: 0 },
  { type: "Personal", value: 0 },
  { type: "Miscellaneous", value: 0 },
];

const ChartPie = ({ items }) => {
  const [total, setTotal] = useState(0);

  const updateData = (newData) => {
    return categoryOptions.map((category) => ({
      ...category,
      value: newData
        .filter((x) => x.category === category.type)
        .reduce((acc, val) => acc + parseFloat(val.price), 0),
    }));
  };

  const config = {
    appendPadding: 10,
    data: updateData(items),
    angleField: "value",
    colorField: "type",
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <>
      <div className="max-w-[600px] w-full">
        <h1 className="font-semibold">Expense ChartPie</h1>
        <Pie {...config} />
      </div>
    </>
  );
};

export default ChartPie;
