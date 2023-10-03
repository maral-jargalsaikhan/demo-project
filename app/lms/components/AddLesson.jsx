import { Button, Drawer, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { LinkOutlined, PlusOutlined, YoutubeOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { db, storage } from "@/app/firebase.config";

const AddLesson = () => {
  const { user } = UserAuth();
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  // const [imageUpload, setImageUpload] = useState(null);

  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    // image: "",
    link: "",
    category: "",
    created_in: "",
    created_by: "",
  });

  // const uploadImage = () => {
  //   if (imageUpload == null) return null;

  //   const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
  //   return uploadBytes(imageRef, imageUpload);
  // };

  const addNewLesson = async (e) => {
    e.preventDefault();
    try {
      if (
        newLesson.title !== "" &&
        newLesson.description !== "" &&
        newLesson.category !== "" &&
        newLesson.link !== ""
      ) {
        // const imageUploadTask = uploadImage();
        // if (imageUploadTask) {
        //   await imageUploadTask;
        // }
        // const imageRef = imageUploadTask ? imageUploadTask.snapshot.ref : null;
        // const imageURL = imageRef ? getDownloadURL(imageRef) : null;

        const docRef = await addDoc(collection(db, "lessons"), {
          title: newLesson.title.trim(),
          description: newLesson.description.trim(),
          // image: imageURL,
          link: newLesson.link,
          category: newLesson.category,
          created_in: new Date().toLocaleDateString(),
          created_by: `${user.displayName}`,
        });

        console.log("new lesson: ", newLesson);
        alert("new lesson successfully added");

        setNewLesson({
          title: "",
          description: "",
          // image: "",
          link: "",
          category: "",
          created_in: "",
          created_by: "",
        });
      } else {
        console.log("Form fields are not complete");
      }
    } catch (error) {
      console.error("error on add document: ", error);
    }
  };

  // READ LESSONS FROM DB
  useEffect(() => {
    const q = query(collection(db, "lessons"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let lessonList = [];

      querySnapshot.forEach((doc) => {
        lessonList.push({ ...doc.data(), id: doc.id });
      });
      setLessons(lessonList);
    });
    return () => unsubscribe();
  }, [lessons]);

  const deleteLesson = async (id) => {
    await deleteDoc(doc(db, "lessons", id));
  };

  const categories = [
    { label: "Web Development", value: "Web Development" },
    { label: "Mobile Development", value: "Mobile Development" },
    { label: "UX & UI Design", value: "UX & UI Design" },
    { label: "Other", value: "Other" },
  ];

  return (
    <>
      <Button
        type="default"
        onClick={() => setIsOpen(true)}
        className="flex items-center"
      >
        <PlusOutlined />
        Add new lesson
      </Button>
      <Drawer
        size="small"
        title="New lesson"
        placement="right"
        onClose={() => setIsOpen(false)}
        open={isOpen}
      >
        <form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label>Title</label>
            <Input
              type="text"
              value={newLesson.title}
              onChange={(e) =>
                setNewLesson({ ...newLesson, title: e.target.value })
              }
              placeholder="Lesson title"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Description</label>
            <TextArea
              value={newLesson.description}
              onChange={(e) =>
                setNewLesson({ ...newLesson, description: e.target.value })
              }
              placeholder="Lesson description"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Category</label>
            <Select
              placeholder="Select a category"
              optionFilterProp="children"
              onChange={(e) => setNewLesson({ ...newLesson, category: e })}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={categories}
            />
          </div>

          {/* <div className="flex flex-col gap-1">
            <label>image</label>
            <div className="flex gap-3">
              <input
                type="file"
                value={newLesson.image}
                onChange={(e) => setImageUpload(e.target.files[0])}
              />
            </div>
          </div> */}

          <div className="flex flex-col gap-1">
            <label>Content</label>
            <div className="p-4 border-[1px] border-neutral-200 rounded-md flex flex-col gap-2">
              <h3 className="font-semibold flex items-center gap-2">
                <LinkOutlined /> Paste a copied link from
                <span className="flex gap-1">
                  <YoutubeOutlined className=" text-[#FF0000]" />
                  YouTube
                </span>
              </h3>
              <Input
                placeholder="Paste a link"
                type="link"
                value={newLesson.link}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, link: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            onClick={addNewLesson}
            className="flex items-center justify-center mt-10"
          >
            <PlusOutlined /> Add new lesson
          </Button>
        </form>
      </Drawer>
    </>
  );
};

export default AddLesson;
