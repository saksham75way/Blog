import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { jwtDecode } from "jwt-decode"; // Install using: npm install jwt-decode

interface Comment {
  id: number;
  content: string;
  blog: any;
  users_permissions_user: any;
  creation_time: string;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
};

// Fetch comments for a blog
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (blogId: number) => {
    const response = await api.get(
      `/comments?filters[blog]=${blogId}&populate=*`
    );
    return response.data.data;
  }
);

// Add a comment with JWT authentication
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ blogId, content }: { blogId: number; content: string }) => {
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      // Decode the JWT token to extract the user ID
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.id; // Ensure your token has "id"

      // Send request with token in headers
      const response = await api.post(
        "/comments",
        {
          data: { content, blog: blogId, users_permissions_user: userId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      await api.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return commentId;
    } catch (error) {
      console.error("Error deleting comment:", error);
      return rejectWithValue(error);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
      });
  },
});

export default commentSlice.reducer;
