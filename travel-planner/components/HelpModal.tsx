"use client";

import { useDisclosure } from '@mantine/hooks';
import { Modal, ActionIcon, Stack } from '@mantine/core';
import {Bold, HelpCircle} from "lucide-react";

export default function HelpModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title style={{fontWeight: "bold"}}>Helpful Information</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Stack>
                {/*create a new div to add another veritcal line*/}
                <div>
                    - Sign-up or sign-in by using the login button
                </div> 
                <div>
                    - Once logged-in you will be able to create trips, view trips, edit trips, and share trip details
                </div> 
                <div>
                  <div style={{fontWeight: "bold"}}>
                  Creating a trip
                  </div>
                  <div>
                    - Asteriks indicate a required field
                  </div>
                  <div>
                    - Select from the drop down menue, when adding a transportation type
                  </div>
                </div>
                <div>
                    -other info...
                </div>
            </Stack>
            </Modal.Body>
          </Modal.Content>
      </Modal.Root>

      <ActionIcon variant="default" onClick={open}>
        <HelpCircle size={20}/>
      </ActionIcon>
    </>
  );
}