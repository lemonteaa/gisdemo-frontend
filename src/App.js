import "./styles.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { Icon } from "leaflet";

import { React, useState, useRef, useMemo } from "react";

import { ChakraProvider } from "@chakra-ui/react";

import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";

import { Input, Button, FormControl, FormErrorMessage, FormLabel, Box, VStack } from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";

import { Select, Checkbox, NumberInput, NumberInputField, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper } from "@chakra-ui/react";

import { Formik, Form, Field } from "formik";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function DraggableMarker(props) {
  console.log(props.position);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          console.log(marker.getLatLng());
          var mylatlng = marker.getLatLng();
          props.setPosition({
            lat: mylatlng.lat,
            lng: mylatlng.lng
          });
        }
      }
    }),
    [props]
  );
  //

  return <Marker draggable={true} eventHandlers={eventHandlers} position={props.position} ref={markerRef}></Marker>;
}

function FormikInput(props) {
  return (
    <Field name={props.name}>
      {({ field, form }) => (
        <FormControl isInvalid={form.errors[props.name] && form.touched[props.name]}>
          <FormLabel htmlFor={props.name}>{props.description}</FormLabel>
          <Input {...field} id={props.name} placeholder={props.description} />
          <FormErrorMessage>{form.errors[props.name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}

//Testing change
function DrawerExample(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>New Shop</DrawerHeader>

          <DrawerBody>
            <Formik
              initialValues={{ name: "Sasuke", addr: "", pricelower: 10 }}
              onSubmit={async (values, actions) => {
                console.log(props.position);
                await sleep(500);
                console.log(JSON.stringify(values, null, 2));
                actions.setSubmitting(false);
              }}
            >
              {() => (
                <Form id="my-form">
                  <Field name="name">
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.name && form.touched.name}>
                        <FormLabel htmlFor="name">Shop Name</FormLabel>
                        <Input {...field} id="name" placeholder="Shop Name" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <FormikInput name="addr" description="Shop Address" />

                  <Field name="reg">
                    {({ field, form }) => (
                      <Select {...field} placeholder="Select Region">
                        <option value="1">United Arab Emirates</option>
                        <option value="2">Nigeria</option>
                      </Select>
                    )}
                  </Field>

                  <Field name="t1">
                    {({ field, form }) => (
                      <Checkbox {...field} size="md" colorScheme="red">
                        Checkbox
                      </Checkbox>
                    )}
                  </Field>
                  <Field name="t2">
                    {({ field, form }) => (
                      <Checkbox {...field} size="md" colorScheme="red">
                        Checkbox
                      </Checkbox>
                    )}
                  </Field>
                  <Field name="t3">
                    {({ field, form }) => (
                      <Checkbox {...field} size="md" colorScheme="red">
                        Checkbox
                      </Checkbox>
                    )}
                  </Field>

                  <Field name="pricelower">
                    {({ field, form }) => (
                      <FormControl>
                        <FormLabel>Amount</FormLabel>
                        <NumberInput {...field} onChange={(val) => form.setFieldValue(field.name, val)} max={50} min={10}>
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    )}
                  </Field>
                </Form>
              )}
            </Formik>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" form="my-form">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function App() {
  const center = {
    lat: 22.3327,
    lng: 114.1709
  };
  const [position, setPosition] = useState(center);
  return (
    <ChakraProvider>
      <DrawerExample className="test-btn" position={position} setPosition={setPosition} />
      <Box>
        <MapContainer center={[22.3327, 114.1709]} zoom={12} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://maptiler-gislab-lemonteaa.cloud.okteto.net/styles/basic-preview/{z}/{x}/{y}.png"
          />
          <DraggableMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </Box>
    </ChakraProvider>
  );
}
