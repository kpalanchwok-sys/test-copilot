import { v4 as uuidV4 } from "uuid";
import RefreshToken from "../shared/models/refreshToken";
import { verifyLocalRefreshToken } from "../utils";

export const updateRefreshToken = async ({
  deviceId,
  userId,
  refreshToken,
  userAgent,
  ipAddress,
  device,
}: {
  deviceId: string;
  userId: string;
  refreshToken: string;
  userAgent: string;
  ipAddress: string;
  device?: string;
}) => {
  const refreshTokenDetails = await RefreshToken.findOne({ userId });

  const decodedToken = verifyLocalRefreshToken(refreshToken);

  const expiresAt = decodedToken.exp
    ? new Date(decodedToken.exp * 1000)
    : new Date();

  const checkDeviceId = deviceId || uuidV4();
  if (refreshTokenDetails) {
    // removing any expired tokens if existed
    const validTokens = refreshTokenDetails.tokens.filter(
      //@ts-ignore
      (token) => new Date(token.expiresAt) > new Date(),
    );

    //@ts-ignore
    const existedToken = validTokens.find((x) => x.deviceId === checkDeviceId);
    const updatedToken =
      deviceId && existedToken
        ? //@ts-ignore
          validTokens?.map((vt) => {
            if (vt.deviceId === existedToken?.deviceId) {
              return {
                ...vt,
                token: refreshToken,
                userAgent,
                ipAddress,
                expiresAt,
                device,
              };
            }
            return vt;
          })
        : [
            ...validTokens,
            {
              deviceId: checkDeviceId,
              token: refreshToken,
              userAgent,
              ipAddress,
              expiresAt,
            },
          ];

    refreshTokenDetails.tokens = updatedToken;
    await refreshTokenDetails.save();
    return { refreshTokenSave: refreshTokenDetails, deviceId: checkDeviceId };
  }

  const newRefreshToken = {
    userId,
    tokens: [
      {
        deviceId: checkDeviceId,
        token: refreshToken,
        userAgent,
        ipAddress,
        expiresAt,
      },
    ],
  };

  const refreshTokenSave = await RefreshToken.create(newRefreshToken);
  return { refreshTokenSave, deviceId: checkDeviceId };
};

export const getRefreshTokenByUserId = async (userId: string) => {
  const userToken = await RefreshToken.findOne({ userId });
  return userToken;
};

export const clearRefreshToken = async (userId: string, deviceId: string) => {
  const refreshTokens = await RefreshToken.findOne({ userId });
  //@ts-ignore
  refreshTokens.tokens = refreshTokens.tokens.map((x) => {
    if (x.deviceId === deviceId) {
      return { ...x, token: "", pushNotificationDeviceId: "" };
    }
    return x;
  });
  //@ts-ignore
  await refreshTokens.save();

  return refreshTokens;
};

export const getUserPushNotificationTokens = async (userId: string) => {
  const refreshToken = await getRefreshTokenByUserId(userId);
  if (!refreshToken) {
    return [];
  }
  const pushTokens = refreshToken.tokens
    .map((t) => t.pushNotificationDeviceId)
    .filter((t) => t);
  return pushTokens;
};

export const saveExpoPushToken = async ({
  userId,
  deviceId,
  pushNotificationDeviceId,
}: {
  userId: string;
  deviceId: string;
  pushNotificationDeviceId: string;
}) => {
  const refreshTokens = await RefreshToken.findOne({ userId });
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  if (!refreshTokens) {
    return RefreshToken.create({
      userId,
      tokens: [
        {
          deviceId,
          token: "",
          expiresAt,
          pushNotificationDeviceId,
        },
      ],
    });
  }

  const tokenExists = refreshTokens.tokens.some((t) => t.deviceId === deviceId);

  if (tokenExists) {
    await RefreshToken.updateOne(
      { userId, "tokens.deviceId": deviceId },
      {
        $set: {
          "tokens.$.pushNotificationDeviceId": pushNotificationDeviceId,
          "tokens.$.expiresAt": expiresAt,
        },
      },
    );
  } else {
    await RefreshToken.updateOne(
      { userId },
      {
        $push: {
          tokens: {
            deviceId,
            token: "",
            expiresAt,
            pushNotificationDeviceId,
          },
        },
      },
    );
  }

  return RefreshToken.findOne({ userId });
};
