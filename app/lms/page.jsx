"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";
import { VideoCameraOutlined } from "@ant-design/icons";
import AddLesson from "../components/AddLesson";
import { Button, Card, Tag, Tooltip } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { motion } from "framer-motion";
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
  const { loading, user } = UserAuth();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const getLessons = async () => {
      try {
        const snapshot = await getDocs(collection(db, "lessons"));
        const lessonsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setLessons(lessonsData);
      } catch (err) {
        console.log("error: ", err.message);
      }
    };
    getLessons();
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : !user ? (
        <p>You must be logged in to view this page.</p>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="mb-5 ml-1 flex gap-3 font-semibold ">
              <VideoCameraOutlined />
              LMS
            </h1>
            <AddLesson />
          </div>

          <motion.ul
            className="container mt-5 max-w-[950px] flex flex-wrap gap-4 justify-between m-auto leading-10"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {lessons.map((lesson, id) => (
              <motion.li key={id} variants={item}>
                <Card
                  style={{
                    width: 220,
                    height: 300,
                    marginBottom: 10,
                    padding: 0,
                  }}
                  cover={
                    <youtube-video width="220" height="150" src={lesson.link} />
                  }
                >
                  <div className="h-[120px] flex flex-col justify-between">
                    <div>
                      <Tooltip title={lesson.title}>
                        <a href={lesson.link} className="font-semibold">
                          {lesson.title.length > 20
                            ? `${lesson.title.slice(0, 19)}...`
                            : lesson.title}
                        </a>
                      </Tooltip>

                      <p className="text-neutral-500 ">
                        {lesson.description.slice(0, 65)}...
                      </p>
                    </div>
                    <div className="flex">
                      <Tag color={tagColor(lesson.category)}>
                        {lesson.category}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
    </div>
  );
};

export default Page;
