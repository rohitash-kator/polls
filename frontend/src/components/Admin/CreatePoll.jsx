import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";

// Helper function to generate a unique id for each option and question
const generateUniqueId = () => "_" + Math.random().toString(36).substring(2, 9);

const CreatePoll = () => {
  // State to hold the poll's data
  const [pollTitle, setPollTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: generateUniqueId(),
      questionLabel: "",
      options: [
        { id: generateUniqueId(), label: "" },
        { id: generateUniqueId(), label: "" },
      ],
    },
  ]);

  // Handler for input change in the poll title
  const handlePollTitleChange = (e) => {
    setPollTitle(e.target.value);
  };

  // Handler for input change in a question's label
  const handleQuestionLabelChange = (e, questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, questionLabel: e.target.value } : q
      )
    );
  };

  // Handler for input change in an option's label
  const handleOptionLabelChange = (e, questionId, optionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, label: e.target.value } : opt
              ),
            }
          : q
      )
    );
  };

  // Handler to add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: generateUniqueId(),
        questionLabel: "",
        options: [
          { id: generateUniqueId(), label: "" },
          { id: generateUniqueId(), label: "" },
        ],
      },
    ]);
  };

  // Handler to remove a question
  const removeQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  // Handler to add a new option to a specific question
  const addOption = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...q.options, { id: generateUniqueId(), label: "" }],
            }
          : q
      )
    );
  };

  // Handler to remove an option from a specific question
  const removeOption = (questionId, optionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((opt) => opt.id !== optionId) }
          : q
      )
    );
  };

  // Handler to submit the poll form
  const handleSubmit = (e) => {
    e.preventDefault();
    const pollData = {
      title: pollTitle,
      questions,
    };

    // Make an API request to save the poll in the database (you need to implement this part on the server)
    // Example:
    // fetch('/api/polls', { method: 'POST', body: JSON.stringify(pollData), headers: { 'Content-Type': 'application/json' } });

    console.log("Poll Data:", pollData);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Create Poll
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Poll Title */}
        <TextField
          label="Poll Title"
          variant="outlined"
          fullWidth
          value={pollTitle}
          onChange={handlePollTitleChange}
          margin="normal"
          required
        />

        {/* Questions Section */}
        {questions.map((question) => (
          <Box key={question.id} mb={3}>
            <Grid container spacing={2}>
              {/* Question Label */}
              <Grid item xs={12}>
                <TextField
                  label="Question"
                  variant="outlined"
                  fullWidth
                  value={question.questionLabel}
                  onChange={(e) => handleQuestionLabelChange(e, question.id)}
                  required
                />
              </Grid>

              {/* Remove Question Button */}
              <Grid item xs={12}>
                <IconButton
                  color="secondary"
                  onClick={() => removeQuestion(question.id)}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </Grid>

              {/* Options Section */}
              {question.options.map((option) => (
                <Grid item xs={12} key={option.id}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                      <TextField
                        label="Option"
                        variant="outlined"
                        fullWidth
                        value={option.label}
                        onChange={(e) =>
                          handleOptionLabelChange(e, question.id, option.id)
                        }
                        required
                      />
                    </Grid>

                    {/* Remove Option Button */}
                    <Grid item xs={2}>
                      <IconButton
                        color="secondary"
                        onClick={() => removeOption(question.id, option.id)}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={() => addOption(question.id)}
                >
                  Add Option
                </Button>
              </Grid>
            </Grid>
          </Box>
        ))}

        {/* Add Question Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<AddCircleIcon />}
          onClick={addQuestion}
        >
          Add Question
        </Button>

        {/* Submit Button */}
        <Box mt={3}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Submit Poll
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreatePoll;
