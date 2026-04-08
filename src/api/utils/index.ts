import jwt from "jsonwebtoken";

export function generateSixDigitOtp() {
  return Math.floor(100000 + Math.random() * 900000); //Adding 100,000 ensures the minimum value is 100,000 (so the OTP is always 6 digits).
}

//  Generate JWT token
export const generateToken = (userId: string) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET || "secretKey", {
    expiresIn: "7d",
  });
};

export const verifyLocalRefreshToken = (token: string) => {
  try {
    if (!process.env.JWT_REFRESH_KEY) {
      throw new Error("JWT refresh secret key is not defined.");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_REFRESH_KEY,
    ) as jwt.JwtPayload;
    return decodedToken;
  } catch (error) {
    console.error("Error Verifying Refresh Token.");
    throw error;
  }
};
