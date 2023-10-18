import { DeleteOutlined } from "@ant-design/icons";
import { async } from "@firebase/util";
import { Button, Empty, message, Popconfirm, Table } from "antd";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "../firebase.config";

const ExpenseList = ({ items }) => {
  const handleDeleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
      message.success("Successfully deleted");
    } catch (error) {
      message.error("Failed to delete expense");
    }
  };

  const columns = [
    { title: "Item", dataIndex: "item", key: "item" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (id) => (
        <Popconfirm
          title="Delete expense"
          description="Are you sure delete this expense?"
          onConfirm={() => handleDeleteExpense(id)}
        >
          <Button
            danger
            type="text"
            className="flex items-center justify-center"
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="w-[500px] mt-5">
      {items && items.length > 0 ? (
        <Table
          columns={columns}
          dataSource={items}
          size="middle"
          scroll={{
            y: 400,
          }}
        />
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default ExpenseList;
