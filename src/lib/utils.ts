import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const api = axios.create({
  baseURL: "http://localhost:3000",
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