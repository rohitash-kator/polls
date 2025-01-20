import { useContext, useEffect, useState } from "react";
import {
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  List,
  ListItem,
  Chip,
  ListItemText,
} from "@mui/material";

import pollService from "../../api/pollService";
import Loader from "../Common/Loader";
import { Link } from "react-router-dom";
import NotificationContext from "../../context/NotificationContext";

const Polls = () => {
  const { addNotification } = useContext(NotificationContext);

  const [polls, setPolls] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const filteredPolls = polls?.filter((poll) => {
    if (filter === "all") return true;
    if (filter === "live")
      return new Date(poll.expiresAt) > new Date() && poll.isActive;
    if (filter === "closed") return !poll.isActive;
    if (filter === "expired") return new Date(poll.expiresAt) < new Date();
    return false;
  });

  useEffect(() => {
    pollService
      .fetchAllPolls()
      .then((fetchedPolls) => setPolls(fetchedPolls))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  const getPollStatus = (isActive, expiry) => {
    const isExpired = new Date() > new Date(expiry);
    if (isActive && !isExpired) return "live";
    if (!isActive) return "closed";
    return "expired";
  };

  const getStatusColor = (pollStatus) => {
    switch (pollStatus) {
      case "live":
        return "success";
      case "closed":
        return "error";
      case "expired":
        return "info";
      default:
        return "default";
    }
  };

  const handleClosePoll = async (pollId) => {
    try {
      const message = await pollService.closePoll(pollId);
      addNotification(message, "success");

      // Refetch polls after closing one
      const fetchedPolls = await pollService.fetchAllPolls();
      setPolls(fetchedPolls);
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

  //   Optimistic Update (Alternative Approach)
  //   const handleClosePoll = async (pollId) => {
  //     try {
  //       // Optimistically close the poll in the UI
  //       setPolls((prevPolls) =>
  //         prevPolls.map((poll) =>
  //           poll._id === pollId ? { ...poll, isActive: false } : poll
  //         )
  //       );
  //       // Now make the actual API call to close the poll
  //       const message = await pollService.closePoll(pollId);
  //       addNotification(message, "success");
  //     } catch (error) {
  //       addNotification(
  //         error?.response?.data?.message ||
  //           error?.message ||
  //           "Something went wrong. Please try again.",
  //         "error"
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <Box
      sx={{
        p: 2,
        m: 2,
        width: "100%",
        maxWidth: "900px", // Center and restrict max width for better UI
        margin: "auto",
        boxShadow:
          "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        borderRadius: 2, // Rounded corners for modern look
        bgcolor: "background.default", // Slightly different background for contrast
      }}
    >
      {/* Filter Radio Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControl component="fieldset" sx={{ marginBottom: 2 }} size="small">
          <RadioGroup
            row
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            name="poll-filter"
            size="small" // Add size="small" to the RadioGroup
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="All"
            />
            <FormControlLabel
              value="live"
              control={<Radio size="small" />}
              label="Live"
            />
            <FormControlLabel
              value="closed"
              control={<Radio size="small" />}
              label="Closed"
            />
            <FormControlLabel
              value="expired"
              control={<Radio size="small" />}
              label="Expired"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Polls List */}
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {filteredPolls?.map((poll) => {
          const pollStatus = getPollStatus(poll.isActive, poll.expiresAt);
          return (
            <ListItem
              key={poll._id}
              sx={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: 3,
                padding: 2,
                bgcolor: "background.paper",
                marginBottom: 2, // Ensure spacing between list items
                display: "flex",
                alignItems: "center", // Align content vertically centered
                justifyContent: "space-between", // Space out buttons and text
              }}
              secondaryAction={
                <>
                  {pollStatus === "live" && (
                    <>
                      <Button
                        component={Link}
                        to={`poll/${poll._id}`}
                        color="info"
                        size="small"
                        variant="contained"
                        sx={{ marginRight: 1 }} // Add spacing between buttons
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => handleClosePoll(poll._id)}
                        color="error"
                        size="small"
                        variant="outlined"
                      >
                        Close
                      </Button>
                    </>
                  )}
                  {pollStatus === "closed" && (
                    <Button color="secondary" size="small" variant="contained">
                      Result
                    </Button>
                  )}
                </>
              }
            >
              <ListItemText
                primary={
                  <>
                    <Chip
                      label={pollStatus}
                      size="small"
                      color={getStatusColor(pollStatus)}
                      sx={{ marginRight: 1 }}
                    />
                    {poll.title}
                  </>
                }
                sx={{ maxWidth: "70%" }} // Ensure title doesn't overflow
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Polls;
