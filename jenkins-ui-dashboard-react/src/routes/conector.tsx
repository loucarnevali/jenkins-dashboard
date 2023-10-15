import React from 'react';
import { useNavigate } from "react-router-dom";

import {
    Bullseye,
    Button,
    Card,
    CardTitle,
    CardBody,
    CardHeader,
    EmptyState,
    EmptyStateHeader,
    EmptyStateIcon,
    EmptyStateFooter,
    EmptyStateVariant,
    EmptyStateActions,
    Gallery,
} from '@patternfly/react-core';  

import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';


export default function conector() {

    const navigate = useNavigate();

    const onClick = () => {
      navigate("/dashboard");
    };

    return (
        <>
            <Gallery hasGutter aria-label="Selectable card container">
              <Card isCompact>
                <Bullseye>
                  <EmptyState variant={EmptyStateVariant.xs}>
                    <EmptyStateHeader
                      headingLevel="h2"
                      titleText="Add a new card to your page"
                      icon={<EmptyStateIcon icon={PlusCircleIcon} />}
                    />
                    <EmptyStateFooter>
                      <EmptyStateActions>
                        <Button variant="link">Add card</Button>
                      </EmptyStateActions>
                    </EmptyStateFooter>
                  </EmptyState>
                </Bullseye>
              </Card>
              <Card
                  hasSelectableInput
                  isCompact
                  isSelectableRaised
                  key="Jenkins"
                  id="01"
                  onClick={() => onClick()}
                >
                <CardHeader>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/742px-Jenkins_logo.svg.png" style={{ maxWidth: '60px' }} />
                </CardHeader>
                <CardTitle>Jenkins 2.425+</CardTitle>
                <CardBody>Integration with pipeline CI/CD</CardBody>
              </Card>
            </Gallery>        
        </>
    )
}