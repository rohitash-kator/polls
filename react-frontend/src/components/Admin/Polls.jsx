import { useContext, useEffect, useState } from "react";
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
} from "@mui/material";

import pollService from "../../api/pollService";
import Loader from "../Common/Loader";
import { useNavigate } from "react-router-dom";
import NotificationContext from "../../context/NotificationContext";
import ListPolls from "../Common/ListPolls";

const Polls = () => {
  const isAuthorized = !!localStorage.getItem("authToken");
  const navigate = useNavigate();
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
    if (!isAuthorized) {
      navigate("/login");
    }
  }, [isAuthorized, navigate]);

  useEffect(() => {
    pollService
      .fetchAllPolls()
      .then((fetchedPolls) => {
        setPolls(fetchedPolls);
        if (fetchedPolls?.length === 0) {
          addNotification("No polls available.", "info");
        }
      })
      .catch((err) => {
        addNotification(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load poll data.",
          "error"
        );
      })
      .finally(() => setLoading(false));
  }, [addNotification]);

  if (loading) {
    return <Loader />;
  }



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
    setLoading(true);
    try {
      const message = await pollService.closePoll(pollId);
      addNotification(message, "success");
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
    <>
      {polls?.length ? (
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
            <FormControl
              component="fieldset"
              sx={{ marginBottom: 2 }}
              size="small"
            >
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
          {filteredPolls.length ? (
            <ListPolls
              polls={filteredPolls}
              handleClosePoll={handleClosePoll}
              getStatusColor={getStatusColor}
            />
          ) : (
            <Typography sx={{ m: 3 }} variant="body2" align="center">
              No polls available for the selected filter.
            </Typography>
          )}
        </Box>
      ) : (
        <Typography sx={{ m: 3 }} variant="body2" align="center">
          No polls available.
        </Typography>
      )}
    </>
  );
};

export default Polls;
