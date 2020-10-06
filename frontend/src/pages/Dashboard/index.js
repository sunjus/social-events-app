import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import socketio from "socket.io-client";
import { Link } from "react-router-dom";
import api from "../../services/api";
import config from "../../config";
import "./dashboard.css";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  CardLink,
  Col,
  Row,
} from "reactstrap";

const Dashboard = ({ history, eventFilter }) => {
  const user_id = localStorage.getItem("user_id");
  const user = localStorage.getItem("user");

  const [events, setEvents] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [messageHandler, setMessageHandler] = useState("");
  const [eventsRequests, setEventsRequests] = useState([]);

  //const [dropdownOpen, setDropdownOpen] = useState(false);
  const [eventRequestMessage, setEventRequestMessage] = useState("");
  const [eventRequestSuccess, setEventRequestSuccess] = useState(false);
  //const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    if (eventFilter.index === 0) {
      getEvents();
    } else if (eventFilter.index === 1) {
      myEventsHandler();
    } else {
      getEvents(eventFilter.list[eventFilter.index].name);
    }
  }, [eventFilter.index]);

  const socket = useMemo(() => {
    if (user_id) {
      return socketio(config.backendURL, {
        query: { user: user_id },
      });
    }
  }, [user_id]);

  useEffect(() => {
    // socket.on('sunju', response => console.log(response))
    if (user_id) {
      socket.on("registration_request", (response) =>
        setEventsRequests([...eventsRequests, response])
      );
    }
  }, [eventsRequests, socket]);

  const category = (query) => {
    getEvents(query);
  };

  const myEventsHandler = async () => {
    try {
      const response = await api.get("/user/events", { headers: { user } });
      console.log(response.data.events);
      setEvents(response.data.events);
    } catch (error) {
      history.push("/login");
    }
  };

  const deleteEventHandler = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`, { headers: { user } });
      setSuccess(true);
      setMessageHandler("Event deleted successfully");
      setTimeout(() => {
        setSuccess(false);
        category(null);
        setMessageHandler("");
      }, 2000);
    } catch (error) {
      setError(true);
      setMessageHandler("Error deleting event!");
      setTimeout(() => {
        setError(false);
        setMessageHandler("");
      }, 2000);
    }
  };

  const getEvents = async (params) => {
    try {
      const url = params ? `/dashboard/${params}` : "/dashboard";
      const response = await api.get(url, { headers: { user } });

      console.log(response.data);
      setEvents(response.data.events);
    } catch {
      history.push("/login");
    }
  };

  const registrationRequestHandler = async (event) => {
    console.log("Clicked");
    try {
      await api.post(`/registration/${event.id}`, {}, { headers: { user } });
      setSuccess(true);
      setMessageHandler(`Successfully registered to event ${event.title}`);
      console.log("Registered");
      setTimeout(() => {
        setSuccess(false);
        category(null);
        setMessageHandler("");
      }, 2000);
    } catch (error) {
      setError(true);
      setMessageHandler(`Could not register to event ${event.title}`);
      console.log("Failed");
      setTimeout(() => {
        setError(false);
        setMessageHandler("");
      }, 2000);
    }
  };

  const acceptEventHandler = async (eventId) => {
    try {
      await api.post(
        `/registration/${eventId}/approvals`,
        {},
        { headers: { user } }
      );
      setEventRequestSuccess(true);
      setEventRequestMessage(`Request approved successfully`);
      removeNotificationFromDashboard(eventId);
      console.log("Registered");
      setTimeout(() => {
        setEventRequestSuccess(false);
        setEventRequestMessage("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const rejectEventHandler = async (eventId) => {
    try {
      await api.post(
        `/registration/${eventId}/rejections`,
        {},
        { headers: { user } }
      );
      setEventRequestSuccess(true);
      setEventRequestMessage(`Request rejected successfully`);
      removeNotificationFromDashboard(eventId);
      //console.log("Registered");
      setTimeout(() => {
        setEventRequestSuccess(false);
        setEventRequestMessage("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const removeNotificationFromDashboard = (eventId) => {
    const newEvents = eventsRequests.filter((event) => event._id !== eventId);
    setEventsRequests(newEvents);
  };

  //Sep.8.20
  //Todo: add logout button nest to create event
  //onclick it should trigger logoutHandler function
  //logoutHandler function will kick users out of the session
  //push to login page

  return (
    <div className="dashboard">
      {eventRequestSuccess ? (
        <Alert color="success" className="event-validation">
          {" "}
          {eventRequestMessage}{" "}
        </Alert>
      ) : (
        ""
      )}
      <ul className="notifications">
        {eventsRequests.map((request) => {
          console.log(request);
          return (
            <li key={request._id}>
              <div>
                <strong>{request.user.email}</strong> is requesting to register
                to your event: <strong>{request.event.title}</strong>
              </div>
              <ButtonGroup>
                <Button
                  color="secondary"
                  onClick={() => {
                    acceptEventHandler(request._id);
                  }}
                >
                  Accept
                </Button>
                <Button
                  color="danger"
                  onClick={() => {
                    rejectEventHandler(request._id);
                  }}
                >
                  Reject
                </Button>
              </ButtonGroup>
            </li>
          );
        })}
      </ul>

      <Row className="events-list">
        {events.map((event) => (
          <Col lg="6" key={event._id}>
            <Card>
              <CardImg
                top
                width="140px"
                height="250px"
                src={event.thumbnail_url}
                alt="Card image cap"
              />

              <CardBody>
                <CardTitle tag="h3">
                  <Link to={`/eventdetail/${event._id}`}>{event.title}</Link>
                </CardTitle>{" "}
                <CardLink
                  href={`/event/${event.id}`}
                  style={{ float: "right" }}
                >
                  <img src="https://img.icons8.com/nolan/25/edit--v1.png" />{" "}
                </CardLink>
                {event.user._id === user_id ? (
                  <CardLink
                    style={{ float: "right" }}
                    onClick={() => deleteEventHandler(event._id)}
                  >
                    {" "}
                    <img src="https://img.icons8.com/nolan/25/delete-forever.png" />{" "}
                  </CardLink>
                ) : (
                  ""
                )}
                <CardText>
                  <img src="https://img.icons8.com/dotty/24/000000/calendar-30.png" />
                  {"  "}
                  {moment(event.date).format("LL")}
                </CardText>
                <CardText>
                  <img src="https://img.icons8.com/ios/24/000000/price-tag-euro.png" />
                  {"  "}
                  {parseFloat(event.price).toFixed(2)}
                </CardText>
                <CardText>
                  <img src="https://img.icons8.com/ios/24/000000/text-box.png" />
                  {"  "}
                  {event.description}
                </CardText>
                <CardText>
                  <img src="https://img.icons8.com/dotty/24/000000/mail-contact.png" />
                  {"  "}
                  <CardLink href={`mailto:${event.user.email}`}>
                    {event.user.firstName} {event.user.lastName}
                  </CardLink>
                </CardText>
                <CardText>
                  <img src="https://img.icons8.com/ios/24/000000/conference-foreground-selected.png" />
                  {"  "}
                  {event.meta.nApproved}
                </CardText>
                <Button
                  style={{ width: "100%" }}
                  onClick={() => {
                    registrationRequestHandler(event);
                  }}
                >
                  Register
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      {error ? (
        <Alert color="danger" className="event-validation">
          {messageHandler}
        </Alert>
      ) : (
        ""
      )}
      {success ? (
        <Alert color="success" className="event-validation">
          {messageHandler}
        </Alert>
      ) : (
        ""
      )}
    </div>
  );
};

export default Dashboard;
