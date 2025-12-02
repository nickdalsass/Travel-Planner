"use client";

import { supabase } from "@/lib/supabase/client";
import {
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 1 ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      const customErrorMessage = "Invalid Email or Password";

      if (error.message === "Invalid login credentials") {
        form.setFieldError("email", customErrorMessage);
        form.setFieldError("password", customErrorMessage);
        return;
      } else {
        alert(`Error: ${error.message}`);
        return;
      }
    }

    router.push("/");
  };

  return (
    <>
      <Center mt={"5%"}>
        <Stack align="center">
          <Paper radius="md" shadow="md" withBorder bg={"#EEEEEE"} p="xl">
            <Stack gap="md">
              <Title order={1}>Log In</Title>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  form.onSubmit(handleSubmit)();
                }}
              >
                <Stack gap="md" w={300}>
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
                    {...form.getInputProps("password")}
                  />
                  <Group justify="center" mt="lg">
                    <Button type="submit" color="#b8626cff">Log In</Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Paper>
          <p style={{ marginTop: "20px" }}>
            Don&apos;t have an account? <a href="/signup">Sign Up</a>
          </p>
        </Stack>
      </Center>
    </>
  );
};
export default LoginPage;
