"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBlog } from "@/store/reducers/blogReducer";
import { Modal, Box, TextField, Button, Typography, Fade } from "@mui/material";

export default function CreateBlogModal({ open, handleClose }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreateBlog = async () => {
    if (!title || !content) return;
    dispatch(addBlog({ title, content }));
    setTitle("");
    setContent("");
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Create a New Blog
          </Typography>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Content"
            variant="outlined"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateBlog}
          >
            Submit
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}
