import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const api = axios.create({
  baseURL: "https://newsletter-backend-eight.vercel.app",
});

export const login = async (username: string, password: string) => {
  const response = await api.post("/login", { username, password });
  return response.data.userId;
};

export const getTotalSubscribers = async () => {
  const response = await api.get("/total-subscribers");
  return response.data.totalSubscribers;
}

export const getTotalEmailsSent = async () => {
  const response = await api.get("/total-emails?userId=" + localStorage.getItem("userId"));
  return response.data.totalEmails;
}

export const sendEmail = async (subject: string, body: string) => {
  const response = await api.post("/send-email", {
    userId: localStorage.getItem("userId"),
    subject,
    body,
  });
  return response.data;
}

export const sendTestEmail = async (subject: string, content: string) => {
  const response = await api.post("/send-test-email", {
    userId: localStorage.getItem("userId"),
    subject,
    content,
  });
  return response.data;
}

export const getAllWallpapers = async () => {
  const response = await api.get("/get-wallpapers");
  // Transform the response to include the isApproved field
  const wallpapers = response.data.wallpapers.map(wallpaper => ({
    ...wallpaper,
    // Rename imageUrl to match backend if needed
    imageUrl: wallpaper.imageUrl || wallpaper.url || "",
    // Add isApproved field if missing from API response
    isApproved: Boolean(wallpaper.isApproved)
  }));
  return wallpapers;
}

export const approveWallpaper = async (id: string) => {
  const response = await api.post("/approve-wallpaper", {
    id
  });
  return response.data;
}