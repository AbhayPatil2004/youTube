import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefeshToken = async (userId) => {

  try {
    const user = await User.findById({ userId })
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  }
  catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access Token")
  }
}

const registerUser = asyncHandler(async (req, res) => {

  const { fullname, email, username, password } = req.body()

  console.log("Email", email)

  if (
    [fullname, email, username, password].some((field) => {
      field.trim() === ""
    })
  ) {
    throw new ApiError(400, "All fields are Required")
  }

  const existedUser = User.findOne({
    $or: [
      { email }, { username }
    ]
  })

  if (existedUser) {
    throw new ApiError(409, "User already Exit")
  }

  const avatarLocalPath = req.files?.avatar[0].path
  const coverImageLocalPath = req.files?.coverImage[0].path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required")
  }

  const avtar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avtar) {
    throw new ApiError(400, "Avatar file required")
  }

  const user = await User.create(
    {
      fullname,
      avatar: avtar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowercase()

    }
  )

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while creting user")
  }

  return res.status(201).hson(
    new ApiResponse(200, userCreated, "User register Succesfully")
  )

});

const loginUser = asyncHandler(async (req, res) => {

  const { email, username, password } = await req.body()

  if (!email || !username) {

    throw new ApiError(400, "Email Or Username is Required")
  }

  const user = await User.findOne(
    {
      $or: [
        { username },
        { email }
      ]
    }
  )

  if (!user) {
    throw new ApiError(400, "User does not Exits")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Credentials")
  }

  const { refreshToken, accessToken } = await generateAccessAndRefeshToken(user._id)

  const loggedInUser = User.findById(user._id).
    select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User Logged IN Succesfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {

  try {
    await User.findByIdAndUpdate{
      req.user._id,
      {
        $set: {
          refreshToken: undefined
        }
      },

      {
        new: true
      }
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    return res.status(200)
  }
  catch (error) {
    console.log(error)
  }

})



export {
  registerUser,
  loginUser,
  logoutUser
};
