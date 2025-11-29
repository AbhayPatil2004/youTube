import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

export const verifJWT = asyncHandler( async( req , res , next ) => {
   try {
     const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" , "")
 
     if( !token ){
         throw new ApiError( 401 , "Unathorized User")
     }
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user = await User.findById( decodedToken?._id ).select("-password -refreshToken")
 
     if( !user ){
         throw new ApiError( 401 , "Invalid Access Token")
     }
 
     req.user = user ;
     next()
   } catch (error) {
    throw new ApiError(401 , "Something went wrong")
   }
})