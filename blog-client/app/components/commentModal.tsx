"use client";
import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchComments } from "../../store/reducers/commentReducer";

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  blogId: number;
}

export default function CommentModal({
  open,
  onClose,
  blogId,
}: CommentModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading, error } = useSelector(
    (state: RootState) => state.comments
  );

  useEffect(() => {
    if (open) {
      dispatch(fetchComments(blogId));
    }
  }, [open, blogId, dispatch]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle color="primary">Comments</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress color="primary" />
        ) : error ? (
          <Typography color="error">Error loading comments</Typography>
        ) : comments.length > 0 ? (
          <List>
            {comments.map((comment: any) => (
              <ListItem key={comment.id} divider>
                <ListItemText
                  primary={comment.content}
                  secondary={`By: ${comment.users_permissions_user.username}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No comments yet.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
