import { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../services/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { identifier, password } = req.body;
    const response = await api.post("/auth/local", { identifier, password });

    return res.status(200).json(response.data);
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.response?.data?.message || "Login failed" });
  }
}
