import React, { useState } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { Modal, Button } from "antd";

const Login = () => {
  const { user, loginGoogle } = UserAuth();
  const [isOpen, setIsOpen] = useState(false);

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
      >
        <Button
          onClick={loginHandler}
          className="flex items-center gap-3 mx-auto my-5 p-5"
        >
          <FcGoogle /> Login with Google Account
        </Button>
      </Modal>
    </div>
  );
};

export default Login;
