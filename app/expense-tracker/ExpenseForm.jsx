import { EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select } from "antd";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase.config";

const initialState = {
  item: "",
  price: "",
  category: "",
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const categoryOptions = [
  { label: "Food", value: "Food" },
  { label: "Insurance", value: "Insurance" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Personal", value: "Personal" },
  { label: "Miscellaneous", value: "Miscellaneous" },
];

const ExpenseForm = () => {
  const [newExpense, setNewExpense] = useState([initialState]);

  const [form] = Form.useForm();

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (newExpense.item && newExpense.price && newExpense.category) {
      await addDoc(collection(db, "items"), {
        item: newExpense.item.trim(),
        price: newExpense.price,
        category: newExpense.category,
      });
      message.success("This expense successfully added :)");
      setNewExpense(initialState);
    } else {
      message.error("Pease fill out all fileds :|");
    }
  };

  const onReset = () => {
    form.resetFields();
    console.log("clicked on reset button");
  };

  return (
    <>
      <Form form={form} name="Expense" layout="inline" style={{ width: 800 }}>
        <Form.Item name="item" label="Item">
          <Input
            type="text"
            placeholder="Enter item"
            value={newExpense.item}
            onChange={(e) =>
              setNewExpense({ ...newExpense, item: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item name="price" label="Price">
          <Input
            type="number"
            placeholder="Enter price"
            value={newExpense.price}
            onChange={(e) =>
              setNewExpense({ ...newExpense, price: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Select
            placeholder="Select category"
            options={categoryOptions}
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e })}
          />
        </Form.Item>
        <div className="flex gap-2">
          <Button
            htmlType="submit"
            onClick={handleAddExpense}
            shape="circle"
            className="flex justify-center items-center"
          >
            <PlusOutlined size={10} />
          </Button>
          <Button
            onClick={onReset}
            shape="circle"
            className="flex justify-center items-center"
          >
            <ReloadOutlined />
          </Button>
        </div>
      </Form>
    </>
  );
};

export default ExpenseForm;
