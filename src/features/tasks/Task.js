import { useNavigate } from "react-router-dom";
import { useGetTasksQuery } from "./tasksApiSlice";
import { memo } from "react";

// MUI TABLE
import { TableCell, TableRow } from "@mui/material";
import { Edit } from "@mui/icons-material";

const Task = ({ taskId }) => {
  const { task } = useGetTasksQuery("tasksList", {
    selectFromResult: ({ data }) => ({
      task: data?.entities[taskId],
    }),
  });

  const navigate = useNavigate();

  if (task) {
    const updated = new Date(task.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/tasks/${taskId}`);

    return (
      <TableRow
        key={task.title}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          {task.completed ? (
            <span className="task__status--completed">Completed</span>
          ) : (
            <span className="task__status--open">Active</span>
          )}
        </TableCell>
        <TableCell>{updated}</TableCell>
        <TableCell>{task.title}</TableCell>
        <TableCell>{task.text}</TableCell>
        <TableCell>{task.customerName}</TableCell>
        <TableCell>{task.username}</TableCell>
        <TableCell sx={{ width: "50px" }}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <Edit />
          </button>
        </TableCell>
      </TableRow>
    );
  } else return null;
};

const memoizedTask = memo(Task);

export default memoizedTask;