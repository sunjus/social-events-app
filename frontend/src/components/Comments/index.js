import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Container,
  ListGroup,
  ListGroupItem,
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import api from "../../services/api";

import "./style.css";

const commentsExample = [
  {
    _id: 1234,
    content: "hi this is nobody",
  },
  {
    _id: 1235,
    content: "comment2",
  },
];
const CommentForm = ({ eventId, refreshComments }) => {
  const [newComment, setNewComment] = useState("");

  const user = localStorage.getItem("user");

  const submitHandler = async (event) => {
    event.preventDefault();
    const postData = {
      comment: {
        eventId: eventId,
        content: newComment,
      },
    };
    console.log("### sub");
    const res = await api.post("/comment", postData, { headers: { user } });
    refreshComments();
  };
  return (
    <div>
      <Form onSubmit={submitHandler}>
        <h3 style={{ display: "inline" }}>New Comment</h3>
        <Button
          disabled={(newComment || "").length < 5}
          type="submit"
          className="secondary-btn"
          style={{ float: "right" }}
        >
          Submit
        </Button>

        <FormGroup>
          <Input
            type="textarea"
            name="newcomment"
            id="newcomment"
            placeholder="Your message"
            onChange={(event) => setNewComment(event.target.value)}
          />
        </FormGroup>
      </Form>
    </div>
  );
};

const Comment = ({ comment }) => {
  console.log(comment);
  return (
    <Row>
      <Col lg="12">
        <div className="media g-mb-30 media-comment">
          <img
            className="d-flex g-width-50 g-height-50 rounded-circle g-mt-3 g-mr-15"
            src="https://bootdey.com/img/Content/avatar/avatar7.png"
            alt="Image Description"
          />
          <div className="media-body u-shadow-v18 g-bg-secondary g-pa-30">
            <div className="g-mb-15">
              <h5
                className="h5 g-color-gray-dark-v1 mb-0"
                style={{ display: "inline" }}
              >{`${comment.user.firstName} ${comment.user.lastName}`}</h5>
              <span
                className="g-color-gray-dark-v4 g-font-size-12 pull-right"
                style={{ float: "right" }}
              >
                {comment.date}
              </span>
            </div>

            <p>{comment.content}</p>
          </div>
        </div>
      </Col>
    </Row>
  );
};
const Comments = ({ history, eventId }) => {
  const [comments, setComments] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(0);

  useEffect(() => {
    getComments(eventId);
  }, [eventId, updateFlag]);

  const getComments = async (eventId) => {
    if (!eventId) {
      return;
    }
    try {
      console.log("###", eventId);
      const response = await api.get(`/comments/event/${eventId}`);
      setComments(response.data);
    } catch {
      //history.push("/")
    }
  };
  const refreshComments = () => {
    console.log("refresh");
    setUpdateFlag(updateFlag + 1);
  };

  const commentReversed = [...comments];
  commentReversed.reverse();

  return (
    <div>
      <CommentForm eventId={eventId} refreshComments={refreshComments} />
      <h3>{comments.length} Comments</h3>
      <Container fluid={true}>
        {commentReversed.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </Container>
    </div>
  );
};

export default Comments;
