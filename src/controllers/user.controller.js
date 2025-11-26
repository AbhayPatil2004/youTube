import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary"
import { ApiResponse  } from "../utils/ApiResponse.js";


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

  if( existedUser ){
    throw new ApiError(409, "User already Exit")
  }

  const avatarLocalPath = req.files?.avatar[0].path
  const coverImageLocalPath = req.files?.coverImage[0].path

  if( !avatarLocalPath ){
    throw new ApiError( 400 , "Avatar is required")
  }

  const avtar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if( !avtar ){
    throw new ApiError( 400 , "Avatar file required")
  }

  const user = await User.create(
    {
      fullname ,
      avatar : avtar.url,
      coverImage : coverImage?.url || "" ,
      email ,
      password ,
      username : username.toLowercase()

    }
  )

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken" 
  ) 

  if( !userCreated ){
    throw new ApiError(500 , "Something went wrong while creting user")
  }
    
  return res.status(201).hson(
    new ApiResponse( 200 , userCreated , "User register Succesfully")
  )

});

export { registerUser };
