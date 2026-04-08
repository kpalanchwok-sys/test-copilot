import keys from "./keys";

export default {
  ENVS: {
    PROD: "production",
    DEV: "development",
    STAGE: "staging",
  },

  ...keys,
};

// import dotenv from "dotenv";
// dotenv.config();

// const config = {
//   PORT: process.env.PORT || 4500,
//   ENV: process.env.ENV || "development",
//   DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING || "",
// };

// export default config;
