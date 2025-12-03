"use client";

import { Center, Button, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Dropzone, DropzoneProps, FileWithPath } from "@mantine/dropzone";
import { ImageIcon, Upload, X, Earth, Home } from "lucide-react";
import { useState } from "react";
import ShareTripButton from "./ShareTripButton";
import "@mantine/dropzone/styles.css";

const ShareTripPage = (props: Partial<DropzoneProps>) => {
  const [file, setFile] = useState<File | null>(null);

  const pdfPreview = file ? (
    <Paper withBorder p="sm">
      <Stack gap={2}>
        <Text size="sm" fw={500} truncate="end">
          {file.name}
        </Text>
        {/* display the file size neatly and truncate the file name for the display */}
        <Text size="xs" c="dimmed">
          {(file.size / 1024).toFixed(1)} KB
        </Text>
      </Stack>
    </Paper>
  ) : null;

  return (
    <Stack align="center">
      <Title mt={"lg"}>
        <Earth /> Share a Trip
      </Title>
      <Dropzone
        h={"50vh"}
        w={"75vh"}
        onDrop={(acceptedFiles) => {
          setFile(acceptedFiles[0] ?? null);
        }}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        maxFiles={1}
        accept={{
          "application/pdf": [".pdf"],
        }}
        {...props}
      >
        <Center>
          <Stack align="center" mt={"15vh"}>
            <Dropzone.Accept>
              <Upload size={32} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <X size={32} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <ImageIcon size={32} />
            </Dropzone.Idle>

            <Text size="xl">
              Drag Your Downloaded Trip PDF Here or Click to Select a File
            </Text>
            <Text size="sm" c="dimmed">
              The file must be a PDF and should not exceed 5MB. Only one file at a time.
            </Text>
          </Stack>
        </Center>
      </Dropzone>
      <SimpleGrid w="75vh">
        {pdfPreview}
      </SimpleGrid>
      {file ?
        <Group justify="space-between" mt="md" gap="xl">
          <ShareTripButton file={file} />
          <Button leftSection={<Home />} onClick={() => window.location.href = '/'} color="#b8626cff">Go Home</Button>
        </Group> : null}
    </Stack>
  );
};
export default ShareTripPage;
