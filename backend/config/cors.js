import cors from "cors";

const corsConfig = {
  origin: function (origin, callback) {
    console.log("🌐 CORS request from origin:", origin);

    const allowedOrigins =
      process.env.NODE_ENV === "development"
        ? ["http://localhost:3000", "http://localhost:3001"]
        : ["https://pagebuilderhere.netlify.app"];

    // Allow requests with no origin (like mobile apps, curl requests, or same-origin)
    if (!origin || origin === "null") return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      console.log("✅ Origin allowed:", origin);
      callback(null, true);
    } else {
      console.log("❌ Origin NOT allowed:", origin);
      console.log("Allowed origins:", allowedOrigins);
      console.log("NODE_ENV:", process.env.NODE_ENV);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Headers",
  ],
  exposedHeaders: ["set-cookie"],
};

export default cors(corsConfig);
