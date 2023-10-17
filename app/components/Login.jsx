import React, { useState } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { Modal, Button, Form, Input, Divider } from "antd";

const Login = () => {
  const { user, loginGoogle } = UserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const btnProps = {
    className: "flex justify-center items-center text-blue-500",
    style: { height: 30 },
  };

  const showModal = () => setIsOpen(true);
  const handleOk = () => setIsOpen(false);
  const handleCancel = () => setIsOpen(false);

  const loginHandler = async () => {
    try {
      await loginGoogle();

      // const userRef = firebase.firestore().collection("users").doc(email);
      // const userDoc = await userRef.get();
      // if (userDoc.exists) {
      //   await loginGoogle();
      // } else {
      //   error("You are not registered.");
      // }
    } catch (error) {
      console.log("error on sign in handler: ", error);
    }
  };

  return (
    <div>
      <Button type="default" onClick={showModal} {...btnProps}>
        Login
      </Button>
      <Modal
        title="Login"
        onOk={handleOk}
        onCancel={handleCancel}
        open={isOpen}
        className="p-5"
      >
        <Form className="w-10/12 mx-auto my-3">
          <div className="flex justify-between gap-2">
            <Form.Item className="w-full">
              <Input
                placeholder="Type Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item className="w-full">
              <Input
                placeholder="Type Password"
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
          </div>

          <Button
            type="default"
            className="uppercase flex items-center justify-center w-full p-5"
          >
            login
          </Button>
        </Form>
        <Divider />
        <Button
          onClick={loginHandler}
          className="flex items-center gap-3 mx-auto my-5 p-5 w-10/12 justify-center"
        >
          <FcGoogle /> Login with Google
        </Button>
      </Modal>
    </div>
  );
};

export default Login;
