import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";

// MUI TABLE
import {
  TableCell,
  TableRow,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

const Note = ({ noteId }) => {
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  });

  const navigate = useNavigate();

  if (note) {
    const updated = new Date(note.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/notes/${noteId}`);

    return (
      <TableRow key={note.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell align="center" component="th" scope="row">
          {note.ticket}
        </TableCell>
        <TableCell>
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Active</span>
          )}
        </TableCell>
        <TableCell>{updated}</TableCell>
        <TableCell>{note.title}</TableCell>
        <TableCell>{note.text}</TableCell>
        <TableCell>{note.username}</TableCell>
        <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <Edit />
          </button>
        </TableCell>
      </TableRow>
    );
  } else return null;
};

const memoizedNote = memo(Note);

export default memoizedNote;