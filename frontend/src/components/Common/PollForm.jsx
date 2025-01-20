import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  CircularProgress,
} from "@mui/material";
import { green, blue, red } from "@mui/material/colors";
import NotificationContext from "../../context/NotificationContext";
import pollService from "../../api/pollService";
import Loader from "./Loader";

const PollForm = () => {
  const { id } = useParams();
  const { addNotification } = useContext(NotificationContext);
  const [poll, setPoll] = useState({});
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(true);

  useEffect(() => {
    setLoading(true);
    pollService
      .fetchPollById(id)
      .then((poll) => setPoll(poll))
      .catch((err) => {
        addNotification(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load poll data.",
          "error"
        );
      })
      .finally(() => setLoading(false));
  }, [id, addNotification]);

  // Check required questions
  useEffect(() => {
    const allRequiredAnswered = poll?.questions?.every(
      (question) => !question.isRequired || answers[question._id]
    );
    setDisabledSubmit(!allRequiredAnswered);
  }, [answers, poll.questions]);

  if (loading) {
    return <Loader />;
  }

  const handleChange = (questionId, optionId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formattedAnswers = poll.questions
      .map((question) => {
        if (answers[question._id]) {
          return {
            questionId: question._id,
            optionId: answers[question._id],
          };
        }
        return null;
      })
      .filter(Boolean);

    const payload = { answers: formattedAnswers };

    try {
      const message = await pollService.submitPoll(id, payload);
      addNotification(message, "success");
    } catch (error) {
      addNotification(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "60%",
        // maxWidth: 800,
        margin: "0 auto",
        padding: 4,
        // backgroundColor: "",
        borderRadius: 3,
        boxShadow: 5,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          marginBottom: 4,
          fontWeight: 600,
          color: blue[800],
        }}
      >
        {poll.title}
      </Typography>

      {poll?.questions?.length ? (
        poll.questions.map((question, index) => (
          <Card
            key={question._id}
            sx={{
              marginBottom: 3,
              borderRadius: 3,
              backgroundColor: "#fff",
              boxShadow: 2,
              transition: "box-shadow 0.3s ease",
              "&:hover": { boxShadow: 5 },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 2,
                  fontWeight: 500,
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {index + 1}.{" "}
                <span
                  style={{
                    fontSize: "0.85em",
                    color: question.isRequired ? red[500] : blue[700],
                    marginLeft: "4px",
                  }}
                >
                  {question.isRequired && "*"}
                </span>{" "}
                {question.question}
              </Typography>

              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <RadioGroup
                  name={`question-${question._id}`}
                  value={answers[question._id] || ""}
                  onChange={(e) => handleChange(question._id, e.target.value)}
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option._id}
                      value={option._id}
                      control={
                        <Radio
                          sx={{
                            color: green[500],
                            "&.Mui-checked": { color: green[700] },
                          }}
                        />
                      }
                      label={option.option}
                      sx={{
                        pl: 1,
                        borderRadius: 2,
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor: green[50],
                        },
                        "&.Mui-selected": {
                          backgroundColor: green[100],
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          No questions available.
        </Typography>
      )}

      <CardActions sx={{ justifyContent: "end", marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={disabledSubmit || loading}
          sx={{
            width: "100%",
            maxWidth: 220,
            padding: 1.5,
            textTransform: "none",
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: blue[700],
            "&:hover": {
              backgroundColor: blue[800],
            },
            transition: "background-color 0.3s ease",
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Submit Poll"
          )}
        </Button>
      </CardActions>
    </Box>
  );
};

export default PollForm;
