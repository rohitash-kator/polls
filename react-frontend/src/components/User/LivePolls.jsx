import { useContext, useEffect, useState } from "react";
import ListPolls from "../Common/ListPolls";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import pollService from "../../api/pollService";
import NotificationContext from "../../context/NotificationContext";
import Loader from "../Common/Loader";

const LivePolls = () => {
  const isAuthorized = !!localStorage.getItem("authToken");
  const navigate = useNavigate();
  const addNotification = useContext(NotificationContext);

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
    }
  }, [isAuthorized, navigate]);

  useEffect(() => {
    pollService
      .fetchLivePolls()
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

  return (
    <>
      {polls.length ? (
        <ListPolls
          polls={polls}
          handleClosePoll={() => {}}
          getStatusColor={() => {}}
        />
      ) : (
        <Typography sx={{ m: 3 }} variant="body2" align="center">
          No polls available.
        </Typography>
      )}
    </>
  );
};

export default LivePolls;
