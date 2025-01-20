import { useContext, useState } from "react";
import {
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Tooltip,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import pollService from "../../api/pollService";
import NotificationContext from "../../context/NotificationContext";

// Helper function to generate a unique id for each option and question
const generateUniqueId = () => "_" + Math.random().toString(36).substring(2, 9);

const CreatePoll = () => {
  const { addNotification } = useContext(NotificationContext);

  const [pollTitle, setPollTitle] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: generateUniqueId(),
      questionLabel: "",
      isRequired: false, // By default, set to optional
      options: [
        { id: generateUniqueId(), label: "" },
        { id: generateUniqueId(), label: "" },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handlePollTitleChange = (e) => {
    setPollTitle(e.target.value);
  };

  const handleExpiryDateChange = (e) => {
    setExpiresAt(e.target.value);
  };

  const handleQuestionLabelChange = (e, questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, questionLabel: e.target.value } : q
      )
    );
  };

  const handleQuestionRequiredChange = (e, questionId) => {
    const { checked } = e.target;
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, isRequired: checked } : q
      )
    );
  };

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

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: generateUniqueId(),
        questionLabel: "",
        isRequired: false, // Default to optional
        options: [
          { id: generateUniqueId(), label: "" },
          { id: generateUniqueId(), label: "" },
        ],
      },
    ]);
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

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

  const removeOption = (questionId, optionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((opt) => opt.id !== optionId) }
          : q
      )
    );
  };

  const formatDate = (date) => {
    const d = date
      ? new Date(date)
      : new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the poll data to match the backend format
    const pollData = {
      title: pollTitle,
      expiresAt: formatDate(expiresAt),
      questions: questions.map((q) => ({
        question: q.questionLabel,
        isRequired: q.isRequired,
        options: q.options.map((opt) => opt.label),
      })),
    };

    try {
      setLoading(true); // Start loader
      const poll = await pollService.createPoll(pollData);
      addNotification(poll?.message, "success");
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      if (validationErrors?.length > 0) {
        validationErrors?.map((err) => {
          addNotification(err?.msg, "error");
        });
      } else {
        addNotification(error?.message, "error");
      }

      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "8px",
        boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
        p: 4,
        margin: 3,
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Create Poll
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Poll Title */}
        <Box
          sx={{
            backgroundColor: "#f7f7f7",
            p: 3,
            borderRadius: "8px",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
            mb: 3,
          }}
        >
          <TextField
            label="Poll Title"
            variant="outlined"
            fullWidth
            value={pollTitle}
            onChange={handlePollTitleChange}
            margin="normal"
            required
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
            }}
          />
        </Box>

        {/* Expiry Date */}
        <Box
          sx={{
            backgroundColor: "#f7f7f7",
            p: 3,
            borderRadius: 2, // Use the shorthand value for consistent styling
            boxShadow: 2, // Use shorthand for boxShadow
            mb: 3,
          }}
        >
          <Typography variant="caption">Poll Expiry Date</Typography>
          <TextField
            variant="outlined"
            size="small"
            type="date"
            fullWidth
            value={expiresAt} // Ensure default date is set to tomorrow if no value
            onChange={handleExpiryDateChange}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 2, // Reuse borderRadius value for consistency
              "& .MuiFormHelperText-root": {
                color: "info.main",
              },
            }}
            helperText={`Default date is set to tomorrow`}
            slotProps={{
              inputLabel: {
                shrink: true, // Ensures label is always visible
              },
            }}
          />
        </Box>

        {/* Questions Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {questions.map((question, index) => (
            <Box
              key={question.id}
              sx={{
                backgroundColor: "#ffffff",
                p: 3,
                boxShadow: "2px 2px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Box display="flex" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Question {index + 1}
                </Typography>
                <Tooltip title="Remove this question">
                  <span>
                    <IconButton
                      color="error"
                      onClick={() => removeQuestion(question.id)}
                      disabled={questions.length <= 1}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              {/* Question Required/Optional */}
              <FormControlLabel
                control={
                  <Switch
                    checked={question.isRequired}
                    onChange={(e) =>
                      handleQuestionRequiredChange(e, question.id)
                    }
                    name="isRequired"
                    color="primary"
                  />
                }
                label="Mandatory Question"
              />

              {/* Question Label */}
              <TextField
                label="Question"
                size="small"
                variant="outlined"
                fullWidth
                value={question.questionLabel}
                onChange={(e) => handleQuestionLabelChange(e, question.id)}
                required
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  mb: 2,
                }}
              />

              {/* Options Section */}
              <Grid container spacing={2}>
                {question.options.map((option, optionIdx) => (
                  <Grid xs={12} sm={6} key={option.id}>
                    <TextField
                      label={`Option ${optionIdx + 1}`}
                      size="small"
                      variant="outlined"
                      value={option.label}
                      onChange={(e) =>
                        handleOptionLabelChange(e, question.id, option.id)
                      }
                      required
                      fullWidth
                      sx={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <Tooltip title="Remove this option">
                              <span>
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    removeOption(question.id, option.id)
                                  }
                                  disabled={question.options.length <= 2}
                                >
                                  <RemoveCircleIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          ),
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Add Option Button */}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={() => addOption(question.id)}
                  sx={{ width: "100%" }}
                >
                  Add Option
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Add Question Button */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={addQuestion}
            sx={{ width: "100%" }}
          >
            Add Question
          </Button>
        </Box>

        {/* Submit Button */}
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              py: 1.5,
              backgroundColor: "#4CAF50",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                {" "}
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                {" Processing"}
              </>
            ) : (
              "Submit Poll"
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreatePoll;
