export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  API_WEB_SOCKET_URL:
    import.meta.env.VITE_API_WEB_SOCKET_URL || "http://localhost:4000/hub",
};
