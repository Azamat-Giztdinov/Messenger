import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formSchema } from "@messenger-clone/common";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from "../AccountContext";
import TextField from "../TextField";

const Login = () => {
  const { setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={formSchema}
      onSubmit={(values, actions) => {
        const vals = { ...values };
        actions.resetForm();
        fetch(`http://localhost:4000/auth/login`, {
            method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vals),
        })
          // .catch(err => {
          //   console.log('err')
          //   return;
          // })
          .then(res => {
            console.log('then1')
            if (!res || !res.ok || res.status >= 400) {
              return;
            }
            return res.json();
          })
          .then(data => {
            console.log('then2')

            if (!data) return;
            setUser({ ...data });
            if (data.status) {
              setError(data.status);
            } else if (data.loggedIn) {
              localStorage.setItem("token", data.token);
              navigate("/home");
            }
          })
          .catch(err => {
            console.log('err')
            return;
          });
      }}
    >
      <VStack
        as={Form}
        w={{ base: "90%", md: "500px" }}
        m="auto"
        justify="center"
        h="100vh"
        spacing="1rem"
      >
        <Heading>Log In</Heading>
        <Text as="p" color="red.500">
          {error}
        </Text>
        <TextField
          name="username"
          placeholder="Enter username"
          autoComplete="off"
          label="Username"
        />

        <TextField
          name="password"
          placeholder="Enter password"
          autoComplete="off"
          label="Password"
          type="password"
        />

        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Log In
          </Button>
          <Button onClick={() => navigate("/register")}>
            Create Account
          </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default Login;