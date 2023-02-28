import { useGetTasksQuery } from "./tasksApiSlice";
import Task from "./Task";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFileCirclePlus
} from "@fortawesome/free-solid-svg-icons"

// MUI TABLE
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const TasksList = () => {
  useTitle("Tasks List");

  const navigate = useNavigate();

  const { username, isManager, isAdmin } = useAuth();

  const {
    data: tasks,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTasksQuery("tasksList", {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = tasks;

    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (taskId) => entities[taskId].username === username
      );
    }

    const onNewTaskClicked = () => navigate("/dash/tasks/new");

    const tableContent =
      ids?.length &&
      filteredIds.map((taskId) => <Task key={taskId} taskId={taskId} />);

    content = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "0.6em"
        }}
      >
        <TableContainer sx={{ width: "99%" }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Updated</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Owner</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableContent}</TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "99%", marginTop: "0.6em", paddingRight: "0.6em" }}>
          <button
            className="icon-button"
            title="Add New Task"
            onClick={onNewTaskClicked}
          >
            <FontAwesomeIcon icon={faFileCirclePlus} />
          </button>
        </Box>
      </Box>
    );
  }

  return content;
};

export default TasksList;
