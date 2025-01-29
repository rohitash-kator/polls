import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Loader from "../Common/Loader";
import pollService from "../../api/pollService";
import { useNavigate, useParams } from "react-router-dom";
import NotificationContext from "../../context/NotificationContext";

const PollResult = () => {
  const isAuthorized = !!localStorage.getItem("authToken");
  const navigate = useNavigate();
  const { id } = useParams();
  const { addNotification } = useContext(NotificationContext);

  const [pollResult, setPollResult] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
    }
  }, [isAuthorized, navigate]);

  useEffect(() => {
    setLoading(true);
    pollService
      .getPollResult(id)
      .then((pollResult) => {
        setPollResult(pollResult);
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
  }, [id, addNotification]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ pr: 2 }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          mt: 1,
          color: "#000", // You can use a theme color for consistency
        }}
      >
        {pollResult?.title}
        <Chip
          sx={{
            ml: 1, // Adds more space between the title and the chip
            mt: 0.5, // Adds top margin to align the chip with the text
            backgroundColor: "secondary.main", // Ensures the chip has a secondary color background
            color: "white", // Makes the chip text stand out by giving it a white color
          }}
          label={`Response: ${pollResult.totalSubmissions}`}
          size="small"
          variant="outlined"
        />
      </Typography>
      <Divider sx={{ marginY: 2 }} />

      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {pollResult?.result?.map((questionData, index) => (
          <Grid xs={12} sm={6} key={index + new Date().getTime()}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, bgcolor: "#fff" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                    {questionData.question}
                  </Typography>
                  <Chip
                    label={`Responses: ${questionData.totalSubmissions}`}
                    size="small"
                    variant="filled"
                    color="primary"
                    sx={{ fontSize: "0.75rem" }}
                  />
                </Box>
                <Divider sx={{ marginY: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <PieChart
                    series={[
                      {
                        data: questionData.options.map((option) => {
                          const percentage = (
                            (option.count / questionData.totalSubmissions) *
                            100
                          ).toFixed(2);
                          return {
                            value: option.count,
                            highlightScope: {
                              fade: "global",
                              highlight: "item",
                            },
                            faded: { innerRadius: 35, additionalRadius: -30 },
                            percentage: percentage,
                            label: `${option.option} (${option.count})`,
                          };
                        }),
                        arcLabel: (item) => `${Math.ceil(item.percentage)}%`,
                        arcLabelMinAngle: 35,
                        arcLabelRadius: "60%",
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fontWeight: "bold",
                        fontSize: "1rem",
                      },
                    }}
                    width={1000}
                    height={350}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PollResult;
