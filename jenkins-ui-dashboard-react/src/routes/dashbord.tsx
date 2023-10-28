import React from 'react';

import { Modal, ModalVariant, Button } from '@patternfly/react-core';

export default function dashboard() {
    const [isModalOpen, setIsModalOpen] = React.useState(true);

    const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
        setIsModalOpen(!isModalOpen);
      };

    return (
    <>
        <React.Fragment>
            <Modal
                variant={ModalVariant.small}
                title="Pipeline Lighthouse"
                isOpen={isModalOpen}
                onClose={handleModalToggle}
                actions={[
                <Button key="cancel" variant="primary" onClick={handleModalToggle}>
                    Confirm
                </Button>
                ]}
            >
                Jenkins is a popular open-source automation tool for implementing continuous integration (CI) and continuous development (CD) workflows called pipelines. 
                Continuous integration and continuous deployment are development practices that can help you deploy your applications faster—and with fewer bugs.  
                But if errors or other issues come up in your pipelines, it can negatively impact deployment and other steps in the DevOps lifecycle. 
                That's why it’s important to monitor not just your applications but also the automation processes around development, including your CI and CD tools. This can help you shift left, 
                which means incorporating more testing on the left side of the DevOps lifecycle.
            </Modal>
        </React.Fragment>
        <iframe src="http://jenkins-ui-dashboard-vuejs:8380/" />
    </>
    );
}
