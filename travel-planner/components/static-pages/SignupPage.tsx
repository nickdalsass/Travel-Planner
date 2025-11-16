"use client";

import { supabase } from "@/lib/supabase/client";
import {
  Anchor,
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";

const SignupPage = () => {
  const form = useForm({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    onSubmitPreventDefault: "validation-failed",
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      username: (value) => {
        if (value.length < 1) return "Username must have at least 1 character";
      },
      email: isEmail("Invalid Email"),
      password: (value) => {
        const passwordValidators: string[] = [];

        if (value.length < 8)
          passwordValidators.push("Minimum of eight characters");
        if (!/[0-9]/.test(value)) passwordValidators.push("One number");
        if (!/[a-z]/.test(value))
          passwordValidators.push("One lowercase letter");
        if (!/[A-Z]/.test(value))
          passwordValidators.push("One uppercase letter");
        if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(value))
          passwordValidators.push("One special symbol");
        if (value.length > 30)
          passwordValidators.push("Maximum of 30 characters");

        return passwordValidators.length > 0
          ? `Requirements: ${passwordValidators.slice(0).join(", ")}`
          : null;
      },
      confirmPassword: (value, values) => {
        if (value !== values.password) return "Passwords do not Match";
      },
    },
  });

  const handleSubmit = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          display_name: values.username,
        },
      },
    });

    if (error) {
      if (error.message === "User already registered") {
        form.setFieldError(
          "email",
          "An account with this email already exists"
        );
        return;
      } else {
        alert(`Error: ${error.message}`);
      }
    }

    const homePageUrl = window.location.origin;
    window.location.href = homePageUrl;
  };

  return (
    <>
      <Center mt={"5%"}>
        <Stack align="center">
          <Paper radius="md" shadow="md" withBorder bg={"#EEEEEE"} p="xl">
            <Stack gap="md">
              <Title order={1}>Sign Up</Title>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  form.onSubmit(handleSubmit)();
                }}
              >
                <Stack gap="md" w={300}>
                  <TextInput
                    name="username"
                    label="Username"
                    withAsterisk
                    autoComplete="off"
                    required
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    placeholder="Enter username..."
                    key={form.key("username")}
                    {...form.getInputProps("username")}
                  />

                  <TextInput
                    name="email"
                    label="Email"
                    withAsterisk
                    required
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    placeholder="worldtraveler@gmail.com"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                  />

                  <PasswordInput
                    name="password"
                    label="Password"
                    withAsterisk
                    required
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    placeholder="Password..."
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                  />

                  <PasswordInput
                    name="confirmPassword"
                    label="Confirm Password"
                    withAsterisk
                    required
                    styles={{
                      input: {
                        borderColor: "#000000",
                      },
                    }}
                    autoComplete="off"
                    placeholder="Confirm Password..."
                    key={form.key("confirmPassword")}
                    {...form.getInputProps("confirmPassword")}
                  />

                  <Group justify="center" mt="lg">
                    <Button type="submit" color="#b8626cff">Sign Up</Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Paper>
          <p style={{ marginTop: "20px" }}>
            Have an account? <Anchor href="/login">Log In</Anchor>
          </p>
        </Stack>
      </Center>
    </>
  );
};
export default SignupPage;
