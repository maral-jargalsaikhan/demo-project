import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Button, Drawer, Input, Select, Form } from "antd";
import { db, storage } from "../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import TextArea from "antd/es/input/TextArea";
import { UserAuth } from "../contexts/AuthContext";

const initialState = {
  title: "",
  description: "",
  category: "",
  URL: "",
};

const categories = [
  { label: "Web Development", value: "Web Development" },
  { label: "Mobile Development", value: "Mobile Development" },
  { label: "UX & UI Design", value: "UX & UI Design" },
  { label: "Other", value: "Other" },
];

const AddEdit = () => {
  const { user } = UserAuth();
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(initialState);
  const { title, description, category, URL } = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [embedLink, setEmbedLink] = useState("");

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    await addDoc(collection(db, "lessons"), {
      ...data,
      timestamp: serverTimestamp(),
      created_by: user.displayName,
    });

    alert("successfully added");
    setData(initialState);
  };

  const handleURLChange = (e) => {
    const link = e.target.value;
    const linkID = link.split("v="[1]);
    const embedLink = linkID
      ? `https://www.youtube.com/embed/${linkID[1]}`
      : "";

    console.log("embedLink: ", embedLink);

    setData({ ...data, URL: embedLink });
  };

  return (
    <>
      <div>
        <Button onClick={() => setIsOpen(true)} type="default">
          Add New Lesson
        </Button>
        <Drawer
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="New Lesson"
        >
          <Form
            onFinish={handleSubmit}
            className="flex flex-col gap-3"
            form={form}
            layout="vertical"
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input your title!" }]}
            >
              <Input
                placeholder="Enter title"
                name="title"
                onChange={handleChange}
                value={title}
              />
            </Form.Item>

            <Form.Item
              label="Desciption"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <TextArea
                placeholder="Enter description"
                name="description"
                onChange={handleChange}
                value={description}
              />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[
                { required: true, message: "Please input your category!" },
              ]}
            >
              <Select
                placeholder="Select a category"
                optionFilterProp="children"
                onChange={(e) => setData({ ...data, category: e })}
                options={categories}
              />
            </Form.Item>

            <Form.Item
              label="URL"
              name="URL"
              rules={[{ required: true, message: "Please input your URL!" }]}
            >
              <Input
                placeholder="https://www.youtube.com/watch?"
                onChange={handleURLChange}
                value={URL}
              />
            </Form.Item>

            <Form.Item label="Image">
              <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </Form.Item>

            <Button
              onClick={handleSubmit}
              type="default"
              disabled={progress !== null && progress < 100}
            >
              Add
            </Button>
          </Form>
        </Drawer>
      </div>
    </>
  );
};

export default AddEdit;
