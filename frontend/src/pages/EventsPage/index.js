import React, { useState, useMemo, useEffect } from "react";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
} from "reactstrap";
import { Redirect } from "react-router";

import thumbnailIcon from "../../assets/thumbnail.png";

import "./events.css";
import api from "../../services/api";
import Axios from "axios";

// TODO
// Add button to navigate to dashboard
// Create successful event creation message

const EventsPage = ({ history, match }) => {
  console.log("call EventPage");
  // console.log(user_id)

  // Declare state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [event, setEvent] = useState({});

  const eventId = match.params.eventId;
  const editMode = eventId ? true : false;

  const user = localStorage.getItem("user");

  //alert fade
  const [visible, setVisible] = useState(true);
  const onDismiss = () => setVisible(false);

  useEffect(() => {
    if (!user) history.push("/login");
  });

  useEffect(() => {
    getEvent(eventId);
  }, [eventId]);

  const getEvent = async (eventId) => {
    let event = {};
    if (editMode) {
      try {
        const response = await api.get(`/event/${eventId}`, {
          headers: { user },
        });
        console.log(response.data);
        event = response.data.event;
        if (
          response.data.authData.user._id !== event.user &&
          response.data.authData.user.email !== "admin@test.com"
        ) {
          history.goBack();
        }
        console.log(event);
      } catch {
        history.push("/login");
      }
    }
    console.log("refill");
    setEvent(event);
    setTitle(event.title || "");
    setDescription(event.description || "");
    setCategory(event.category || "");
    setPrice(event.price || "");
    setDate((event.date || "").substring(0, 10));
    setThumbnail(event.thumbnail);
  };

  const preview = useMemo(() => {
    console.log(thumbnail);
    if (editMode && typeof thumbnail === "string") {
      return event.thumbnail_url;
    } else {
      return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }
  }, [thumbnail]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const eventData = new FormData();

    eventData.append("thumbnail", thumbnail);
    eventData.append("title", title);
    eventData.append("category", category);
    eventData.append("description", description);
    eventData.append("price", price);
    eventData.append("date", date);

    try {
      if (
        title !== "" &&
        description !== "" &&
        category !== "" &&
        date !== "" &&
        price !== "" &&
        thumbnail !== null
      ) {
        console.log("Event has been sent");
        console.log(eventData);
        const resp = await await api.post(
          "/event/" + (editMode ? eventId : ""),
          eventData,
          { headers: { user } }
        );
        if (!editMode) {
          setEvent(resp.data);
        }
        setSuccess(true);
      } else {
        setErrorMessage(true);
        setTimeout(() => {
          setErrorMessage(false);
        }, 2000);

        console.log("Missing required data");
      }
    } catch (error) {
      Promise.reject(error);
      console.log(error);
    }
  };
  console.log("render", title);
  return (
    <Container>
      <h1>{editMode ? "Modify" : "Create"} your Event</h1>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Label> Must Upload Image:</Label>
          <Label
            id="thumbnail"
            style={{ backgroundImage: `url(${preview})` }}
            className={thumbnail ? "has-thumbnail" : ""}
          >
            <Input
              type="file"
              onChange={(event) => setThumbnail(event.target.files[0])}
            />
            <img src={thumbnailIcon} alt="Upload Icon" />
          </Label>
        </FormGroup>
        <FormGroup>
          <Label> Title: </Label>
          <Input
            id="title"
            type="text"
            placeholder={"Set Event Title"}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Select Category</Label>
          <Input
            type="select"
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="cooking">Cooking</option>
            <option value="studying">Studying</option>
            <option value="traveling">Traveling</option>
            <option value="other">Other</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label> Description: </Label>
          <Input
            id="description"
            type="text"
            placeholder={"Set Event Description"}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label> Price: </Label>
          <Input
            id="price"
            type="text"
            placeholder={"Set Event Price"}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label> Date: </Label>
          <Input
            id="date"
            type="date"
            placeholder={"Set Event Date"}
            value={date}
            onChange={(event) => {
              console.log(event.target.value);
              console.log(date);
              setDate(event.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Button type="submit" className="submit-btn">
            {editMode ? "UPDATE" : "CREATE"} EVENT
          </Button>
          {"  "}{" "}
          <Button
            type="submit"
            className="secondary-btn"
            onClick={() => history.push("/")}
          >
            {"  "} HOME {"  "}
          </Button>
        </FormGroup>
      </Form>
      {errorMessage ? (
        <Alert color="danger" className="event-validation">
          <h4> Missing input</h4>
        </Alert>
      ) : (
        ""
      )}
      {success && event._id ? (
        <Redirect to={`/eventdetail/${event._id}`} />
      ) : (
        " "
      )}
    </Container>
  );
};

export default EventsPage;
