import { Button, Chip, List, ListItem, ListItemText } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../../api/userService";
import Loader from "./Loader";

const ListPolls = ({ polls, handleClosePoll, getStatusColor }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getCurrentUser()
      .then((fetchedUser) => setUser(fetchedUser))
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

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {polls?.map((poll) => {
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
                    {user.role === "Admin" && (
                      <Button
                        aria-label={`Close poll ${poll.title}`}
                        onClick={() => handleClosePoll(poll._id)}
                        color="error"
                        size="small"
                        variant="outlined"
                      >
                        Close
                      </Button>
                    )}
                  </>
                )}
                {pollStatus === "closed" && user.role === "Admin" && (
                  <Button
                    color="secondary"
                    size="small"
                    variant="contained"
                    id={poll._id}
                    component={Link}
                    to={`/result/${poll._id}`}
                  >
                    Result
                  </Button>
                )}
              </>
            }
          >
            <ListItemText
              primary={
                <>
                  {/* Conditionally render based on user role */}
                  {user.role !== "admin" ? (
                    <>
                      <Chip
                        label="live"
                        size="small"
                        color="success"
                        sx={{ marginRight: 1 }}
                      />
                      {poll.title} (Admin View)
                    </>
                  ) : (
                    <>
                      <Chip
                        label={pollStatus}
                        size="small"
                        color={getStatusColor(pollStatus)}
                        sx={{ marginRight: 1 }}
                      />
                      {poll.title}
                    </>
                  )}
                </>
              }
              sx={{ maxWidth: "70%" }} // Ensure title doesn't overflow
            />
          </ListItem>
        );
      })}
    </List>
  );
};

ListPolls.propTypes = {
  polls: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      expiresAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  getPollStatus: PropTypes.func.isRequired,
  handleClosePoll: PropTypes.func.isRequired,
  getStatusColor: PropTypes.func.isRequired,
};

export default ListPolls;
