"use client";
import React, { useEffect, useState } from "react";
import {
  UnorderedListOutlined,
  UserAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import AddEdit from "./AddEdit";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.config";
import { motion } from "framer-motion";
import {
  Tag,
  Card,
  Image,
  Modal,
  Segmented,
  Breadcrumb,
  Rate,
  Divider,
} from "antd";
import Spinner from "../components/Spinner";

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
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const openModal = (lesson) => {
    setSelectedLesson(lesson);
  };

  const closeModal = () => {
    setSelectedLesson(null);
  };

  const handleCategory = (e) => {
    setSelectedCategory(e);
  };

  useEffect(() => {
    setLoading(true);
    loading && <Spinner />;

    const unsubscribe = onSnapshot(
      collection(db, "lessons"),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortOptions = [
    { label: "All", value: "All" },
    { label: "Web Development", value: "Web Development" },
    { label: "Mobile Development", value: "Mobile Development" },
    { label: "UX & UI Design", value: "UX & UI Design" },
    { label: "Other", value: "Other" },
  ];

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between">
          <h1 className="capitalize flex gap-3 font-semibold items-center">
            <VideoCameraOutlined />
            Sample LMS
          </h1>
          <AddEdit />
        </div>

        <Divider />
        <div className="flex justify-between">
          <h2 className="ml-1 font-semibold flex items-center">LESSONS</h2>
          <Segmented
            options={sortOptions}
            onChange={(e) => handleCategory(e)}
          />
        </div>
        <motion.ul
          className="container my-10 mx-auto max-w-[940px] flex flex-wrap gap-5"
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
                  style={{ width: 220, height: 360 }}
                  cover={
                    <Image
                      alt="card-image"
                      src={lesson.img}
                      height={210}
                      className="object-cover border"
                    />
                  }
                >
                  <div
                    className="h-[120px] flex flex-col justify-between"
                    onClick={() => openModal(lesson)}
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

                {selectedLesson && (
                  <Modal
                    title={selectedLesson.title}
                    open={selectedLesson === lesson}
                    onOk={closeModal}
                    onCancel={closeModal}
                    width={1000}
                    footer={[]}
                  >
                    <>
                      <Breadcrumb
                        className="flex my-5 justify-end"
                        items={[
                          { title: "LMS" },
                          { title: `${selectedLesson.category}` },
                          { title: `${selectedLesson.title}` },
                        ]}
                      />
                      <div className="w-full flex justify-center my-5">
                        {/* <youtube-video
                          width="800"
                          height="400"
                          src={selectedLesson.URL}
                        /> */}
                        <iframe
                          src={selectedLesson.URL}
                          width="800"
                          height="400"
                        />
                      </div>

                      <div className="flex justify-between items-center mt-5">
                        <h1 className="text-xl font-semibold">
                          {selectedLesson.title}
                        </h1>

                        <h2 className="flex gap-2 text-neutral-500 font-semibold items-center">
                          <UserAddOutlined />
                          {selectedLesson.created_by}
                        </h2>
                      </div>

                      <Rate className="flex justify-end" />

                      <p className="my-5 text-justify ">
                        {selectedLesson.description}
                      </p>

                      <Tag color={tagColor(selectedLesson.category)}>
                        {selectedLesson.category}
                      </Tag>
                    </>
                  </Modal>
                )}
              </motion.li>
            ))}
        </motion.ul>
      </div>
    </>
  );
};

export default Page;
