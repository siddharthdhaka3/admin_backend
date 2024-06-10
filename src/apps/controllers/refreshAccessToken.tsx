import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../schema/User'; // Assuming User model import
import { createUserTokens } from '../services/passport-jwt'; // Assuming token creation function import
import { getUserById } from '../services/user';

const refreshAccessTokenController = async (req: Request, res: Response ) => {
  const { refreshToken } = req.body;
  const authorizationHeader = req.headers.authorization;

  

  let refreshTokenFromHeader;
  if (authorizationHeader && authorizationHeader.startsWith('RefreshToken ')) {
    refreshTokenFromHeader = authorizationHeader.split(' ')[1];
  }

  const refreshToken1 = refreshToken || refreshTokenFromHeader;
  console.log(refreshTokenFromHeader);
  
  try {
    // Verify the refresh token
    const decodedToken:any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    console.log(decodedToken);
    
    console.log("updated");
    // Find the user associated with the decoded token
    const user: any = await getUserById(decodedToken?._id);
    
    if (!user) {
      return res.status(404).json({ message: "No user found for the given token" });
    }

    if (refreshToken !== user.refreshToken) {
      return res.status(401).json({ message: "Mismatched refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = await createUserTokens(user);
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Return the logged-in user, access token, and refresh token
    return res.status(200).json({
      user: loggedInUser,
      accessToken: accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(500).json({ message: "Failed to refresh access token" });
  }
};

export default refreshAccessTokenController;
