import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshTokens = user.generateRefreshToken();
    user.refreshTokens = refreshTokens;
    user.save({ ValidateBeforeSave: false });
    return { accessToken, refreshTokens };
  } catch (error) {
    throw new apiError(
      "500",
      "problem occurs while generating Access and Refresh Tokens",
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, userName, email, password } = req.body;
  console.log("email:", email);

  if (
    [userName, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "all fields must be required");
  }
  const existeduser = User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existeduser) {
    throw new apiError(400, "email or username has been aleady existed");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new apiError(400, "* avatar field is mandotary");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPaths);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new apiError(400, "* avatar field is mandotary");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    userName: userName.toLowerCase(),
  });
  const createduser = await User.findById(user._id).select(
    "-password -refreshTokens",
  );
  if (!createduser) {
    throw new apiError(500, "server is not responding! please try again later");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createduser, "user is successfully registered"));
});
const userLogin = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;
  if (!(email || userName)) {
    //(!email && !userName)
    throw new apiError(400, "email or username doesn't exist");
  }
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new apiError(404, "user doesn't existed please SignIn");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(400, "invalid user credentials");
  }

  const { accessToken, refreshTokens } = await generateAccessandRefreshTokens(
    user._id,
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshTokens",
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshTokens", refreshTokens, options)
    .json(
      new ApiResponse(
        200,
        {
          user: refreshTokens,
          accessToken,
          loggedInUser,
        },
        "userLogged",
      ),
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshTokens: undefined,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshTokens", options)
    .json(new ApiResponse(200, {}, "user logout"));
});

export { registerUser, userLogin, logoutUser };
