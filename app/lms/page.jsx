"use client";
import React, { useEffect, useState } from "react";
import { VideoCameraOutlined } from "@ant-design/icons";
import AddEdit from "./AddEdit";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.config";
import { motion } from "framer-motion";
import { Tag, Card, Image, Modal, Segmented } from "antd";
import "youtube-video-js";

const tagColor = (category) => {
  switch (category) {
    case "Web Development":
      return "gold";
    case "Mobile Development":
      return "blue";
    case "UX & UI Design":
      return "red";
    case "Other":
      return "cyan";
    default:
      return "";
  }
};

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delayChildren: 0.3, staggerChildren: 0.2 },
  },
};

const item = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const Page = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "lectures"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setLessons(list);
        setLoading(false);
      },
      (error) => console.log(error)
    );
    return () => unsubscribe();
  }, []);

  const sortOptions = [
    { label: "All", value: "All" },
    { label: "Web Development", value: "Web Development" },
    { label: "Mobile Development", value: "Mobile Development" },
    { label: "UX & UI Design", value: "UX & UI Design" },
    { label: "Other", value: "Other" },
  ];

  const handleCategory = (e) => {
    setSelectedCategory(e);
    console.log("chosen category: ", e);
  };

  return (
    <>
      <div>
        <div className="flex justify-between">
          <h1 className="mb-5 ml-1 flex gap-3 font-semibold ">
            <VideoCameraOutlined />
            LMS
          </h1>
          <AddEdit />
        </div>

        <div className="flex justify-between">
          <h2 className="ml-1 font-semibold flex items-center">All Lessons</h2>
          <Segmented options={sortOptions} onClick={handleCategory} />
        </div>

        <motion.ul
          className="container mt-5 max-w-[950px] flex flex-wrap gap-4 justify-between m-auto leading-10"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {lessons
            .filter(
              (lesson) =>
                selectedCategory === "All" ||
                lesson.category === selectedCategory
            )
            .map((lesson, id) => (
              <motion.li key={id} variants={item}>
                <Card
                  hoverable
                  style={{ width: 220, height: 330 }}
                  cover={
                    <Image
                      alt="card-image"
                      src={lesson.img}
                      height={180}
                      className="object-cover border"
                    />
                  }
                >
                  <div
                    className="h-[120px] flex flex-col justify-between"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <p className="font-semibold">
                      {lesson.title.length > 20
                        ? `${lesson.title.slice(0, 19)}...`
                        : lesson.title}
                    </p>

                    <p className="text-neutral-500 ">
                      {lesson.description.slice(0, 65)}...
                    </p>
                    <div className="flex mt-2">
                      <Tag color={tagColor(lesson.category)}>
                        {lesson.category}
                      </Tag>
                    </div>
                  </div>
                </Card>

                <Modal
                  title={lesson.title}
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  width={1000}
                  footer={[]}
                >
                  <youtube-video width="220" height="150" src={lesson.URL} />
                </Modal>
              </motion.li>
            ))}
        </motion.ul>
      </div>
    </>
  );
};

export default Page;
