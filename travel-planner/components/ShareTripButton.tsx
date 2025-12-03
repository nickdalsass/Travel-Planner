"use client";

import { Button } from "@mantine/core";
import { FileCheck } from "lucide-react";
import { useState } from "react";

interface ShareTripButtonProps {
  file: File;
}

const ShareTripButton = ({ file }: ShareTripButtonProps) => {
  const [disabled, setDisabled] = useState(false);

  const handleShare = async () => {
    setDisabled(true);//just to make sure the user cant spam the button since its async!
    try {
      if (
        typeof navigator === "undefined" || //verify that youre in a browser env
        !("share" in navigator) ||//verify that you can share in general in this env
        !("canShare" in navigator) ||//same as condition
        !navigator.canShare?.({ files: [file] }) //verify that browser can share files specifically
      ) {
        alert("Sharing files is not supported in this browser. Please attach the PDF manually.");
        return;
      }

      await navigator.share({
        files: [file],
        title: "Trip Information",
        text: "Hey there! Here is a PDF of all my trip information.",
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;//basically we just silently ignore it if the user cancels a share
      }

      console.error("Error sharing file", error);
    } finally {
      setDisabled(false);//once sharing is either done or cancelled,make button clickable again
    }
  };

  return (
    <Button leftSection={<FileCheck />} color="#b8626cff" onClick={handleShare} disabled={disabled}>
      Share Trip PDF
    </Button>
  );
};

export default ShareTripButton;
