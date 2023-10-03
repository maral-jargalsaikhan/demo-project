"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";
import { VideoCameraOutlined } from "@ant-design/icons";
import AddLesson from "./components/AddLesson";
import { Button, Card, Tag } from "antd";
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase.config";

const tagColor = {
  "Web Development": "green",
  "Mobile Development": "blue",
  "UX & UI Design": "red",
  "Other": "lime"
};

// TEST

// const itemsRef = collection(db, "items");
// const itemsSnap = getDoc(itemsRef);

// const seeData = () => {
//   console.log("DATA: ", itemsSnap);
// };

// async function getLessons() {
//   try {
//     const lessonsRef = collection(db, "lessons");
//     let allLessons = await getDoc(lessonsRef);
//     console.log("ALL LESSONS: ", allLessons);
//   } catch (err) {
//     console.log(err);
//   }
// }
async function getLessons() {
  const snapshot = await firebase.firestore().collection('lessons').get()
  const collection = {};
  snapshot.forEach(doc => {
      collection[doc.id] = doc.data();
  });
  return collection;
}

// const categoryColor = tagColor[lesson.category];

// TEST

const { Meta } = Card;

const Page = () => {
  const { loading, user } = UserAuth();

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : !user ? (
        <p>You must be logged in to view this page.</p>
      ) : (
        <div>
          <Button type="dashed" onClick={getLessons} className="mb-5">
            GET ALL LESSONS
          </Button>

          <h1 className="mb-5 ml-1 flex gap-3 font-semibold ">
            <VideoCameraOutlined />
            LMS
          </h1>
          <AddLesson />

          <ul className="w-full h-10 mt-5">
            <li>
              {/* <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <iframe
                    className="rounded-t-lg"
                    src="https://www.youtube.com/embed/W6NZfCO5SIk?si=GtgIaXr02-bu_IIx"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                  ></iframe>
                }
              >
                <Meta
                  title="Europe Street beat"
                  description="Lorem ipsum dolor, sit amet consectetur adipisicing elit..."
                  style={{ display: "flex", gap: 0 }}
                />
                <Tag color="volcano" className="card-tag">
                  Category
                </Tag>
              </Card> */}
            </li>
          </ul>

          {/* <ul className="w-full h-10 mt-5">
            {allLessons.map((lesson, id) => {
              <li key={id}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <iframe
                      className="rounded-t-lg"
                      src={lesson.link}
                      allowfullscreen
                    ></iframe>
                  }
                >
                  <Meta
                    title={lesson.title}
                    description={`${lesson.description.slice(0, 30)}`}
                    style={{ display: "flex", gap: 0 }}
                  />
                  <Tag className="card-tag" color={categoryColor}>
                    {lesson.category}
                  </Tag>
                </Card>
              </li>;
            })}
          </ul> */}
        </div>
      )}
    </div>
  );
};

export default Page;
