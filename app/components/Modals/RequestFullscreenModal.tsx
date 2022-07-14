import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function RequestFullscreenModal({ isOpen, onClose }: Props) {
  const handleClick = () => {
    document.body.requestFullscreen().then(() => screen.orientation.lock("landscape"));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader style={{ fontSize: 18 }}>Enter Full Screen</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p style={{ fontSize: 16 }}>
            In order to deliver the best user experience, I ask you to use the app on full screen
            mode on small screens. Thank you!
          </p>
        </ModalBody>

        <ModalFooter style={{ fontSize: 16 }}>
          <Button colorScheme="blue" mr={3} onClick={handleClick}>
            Enter full screen
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RequestFullscreenModal;
