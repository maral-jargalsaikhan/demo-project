import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { db, storage } from "../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const initialState = {
  name: "",
  email: "",
  info: "",
  contact: "",
};

const AddEdit = () => {
  const [data, setData] = useState(initialState);
  const { name, email, info, contact } = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

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

          switch (snapshot.state) {
            case "paused":
              console.log("upload is pause");
              break;
            case "running":
              console.log("upload is running");
              break;
            default:
              break;
          }
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

  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = "name is required";
    }
    if (!email) {
      errors.email = "email is required";
    }
    if (!info) {
      errors.info = "info is required";
    }
    if (!contact) {
      errors.contact = "contact is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();

    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    await addDoc(collection(db, "users"), {
      ...data,
      timestamp: serverTimestamp(),
    });
    setData(initialState);
  };

  return (
    <>
      <div>
        <Grid
          centered
          verticalAlign="middle"
          columns="3"
          style={{ height: "80vh" }}
        >
          <Grid.Row>
            <Grid.Column textAlign="center">
              <div>
                {isSubmit ? (
                  <Loader active inline="centered" size="huge" />
                ) : (
                  <>
                    <h2 className="text-teal-500 my-3 font-semibold">
                      Add User
                    </h2>
                    <Form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-3"
                    >
                      <Form.Input
                        label="Name"
                        error={errors.name ? { content: errors.name } : null}
                        placeholder="Enter Name"
                        name="name"
                        onChange={handleChange}
                        value={name}
                        autoFocus
                      />
                      <Form.Input
                        label="Email"
                        error={errors.email ? { content: errors.email } : null}
                        placeholder="Enter Email"
                        name="email"
                        onChange={handleChange}
                        value={email}
                      />
                      <Form.TextArea
                        label="Info"
                        error={errors.info ? { content: errors.info } : null}
                        placeholder="Enter Info"
                        name="info"
                        onChange={handleChange}
                        value={info}
                      />
                      <Form.Input
                        label="Contact"
                        error={
                          errors.contact ? { content: errors.contact } : null
                        }
                        placeholder="Enter Contact"
                        name="contact"
                        onChange={handleChange}
                        value={contact}
                      />
                      <Form.Input
                        type="file"
                        label="Upload"
                        onChange={(e) => setFile(e.target.files[0])}
                      />

                      <Button
                        type="submit"
                        className="border rounded bg-slate-100 hover:bg-slate-200 py-1 w-[100px]"
                        disabled={progress !== null && progress < 100}
                      >
                        Submit
                      </Button>
                    </Form>
                  </>
                )}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};

export default AddEdit;
