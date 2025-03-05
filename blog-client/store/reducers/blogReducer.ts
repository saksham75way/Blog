import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { jwtDecode } from "jwt-decode";

export interface Blog {
  id: number;
  title: string;
  content: string;
  slug: string;
  user: any;
  comments: any[];
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
};

// Fetch blogs
export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const response = await api.get("/blogs?populate=*");
  return response.data.data;
});

// Fetch a single blog by ID
export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (blogId: number) => {
    const response = await api.get(`/blogs/${blogId}?populate=*`);
    return response.data;
  }
);

// Add a new blog with JWT authentication
export const addBlog = createAsyncThunk(
  "blogs/addBlog",
  async ({ title, content }: { title: string; content: string }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      // Decode token to get user ID
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await api.post(
        "/blogs",
        {
          data: { title, content, user: userId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.blogs = [action.payload];
        state.loading = false;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      });
  },
});

export default blogSlice.reducer;
