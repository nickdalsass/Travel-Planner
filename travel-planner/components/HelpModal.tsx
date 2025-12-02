"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, ActionIcon, Stack } from "@mantine/core";
import { HelpCircle } from "lucide-react";

export default function HelpModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title style={{ fontSize: 25, fontWeight: "bold" }}>
              Helpful Information
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Stack>
              <div style={{ marginLeft: 20 }}>
                <li>
                  Click the Travel Planner Logo and Title at any time to return
                  to the home page
                </li>
                <li>
                  Sign up or Log in by using the login button in the top right
                  corner
                </li>
                <li>
                  <strong>Note:</strong> You must be logged in with an account
                  to create and view trips
                </li>
                <li>
                  Once logged in, you will be able to create, view, personalize,
                  share, and edit trips
                </li>
              </div>
              <div>
                <div style={{ fontWeight: "bold" }}>Creating a trip</div>
                <div style={{ marginLeft: 20 }}>
                  <li> An asterisk indicates a required field</li>
                  <li>
                    Select from the drop down menu, when adding a transportation
                    type
                  </li>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: "bold" }}>Created Trips</div>
                <div style={{ marginLeft: 20 }}>
                  <li> Search by trip name or location</li>
                  <li>
                    Click the dropdown menu on each trip to view the trip details
                  </li>
                  <li>
                    To edit or delete, simply click the corresponding icon
                  </li>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: "bold" }}>Share a trip</div>
                <div style={{ marginLeft: 20 }}>
                  <li> Share Trips through PDF on Created Trips Page</li>
                  <li>
                    Select "Download PDF" to save the document to your device
                  </li>
                </div>
              </div>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <ActionIcon c="black" variant="transparent" onClick={open}>
        <HelpCircle size={50} />
      </ActionIcon>
    </>
  );
}
