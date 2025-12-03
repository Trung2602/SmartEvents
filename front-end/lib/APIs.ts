import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const BASE_URL = "http://localhost:8080/api";

export const endpoints = {
  // Auth
  "register": "accounts",
  "login": "auth/login",
  "profile": "secure/profile",
  "profile-update": "account/edit",

  // Page
  "page-update": "page-update",
  "page-delete": (id: string | number) => `page-delete/${id}`,
  "page": (id: string | number) => `page/${id}`,
  "pages": "pages",

  // Page Member
  "page-member-update": "page-member-update",
  "page-member-delete": (id: string | number) => `page-member-delete/${id}`,
  "page-member": (id: string | number) => `page-member/${id}`,
  "page-members": "page-members",

  // Page Follower
  "page-follower-update": "page-follower-update",
  "page-follower-delete": (id: string | number) => `page-follower-delete/${id}`,
  "page-follower": (id: string | number) => `page-follower/${id}`,
  "page-followers": "page-followers",
};

export const authApis = () => {
  const token = getCookie("token");

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
