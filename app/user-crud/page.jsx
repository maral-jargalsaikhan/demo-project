"use client";
import React, { useEffect, useState } from "react";
import { UserSwitchOutlined } from "@ant-design/icons";
import AddEdit from "./AddEdit";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.config";
import { Card, Container, Grid, Image } from "semantic-ui-react";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setUsers(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div>
        <h1 className="mb-5 ml-1 flex gap-3 font-semibold ">
          <UserSwitchOutlined />
          User CRUD
        </h1>
        {/* <AddEdit /> */}

        <Container>
          <Card.Group>
            <Grid columns={3} stackable>
              {users &&
                users.map((user, index) => (
                  <Grid.Column key={index}>
                    <Card key={user.id}>
                      <Card.Content>
                        <Image
                          src={user.img}
                          className="w-24 h-24"
                          alt="user"
                        />
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                ))}
            </Grid>
          </Card.Group>
        </Container>
      </div>
    </>
  );
};

export default Page;
