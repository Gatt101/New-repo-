import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const getUsersForSidebar = async ( req,res ) => {
      try{
          const loggedInUserId = req.user._id;
          //find all user except logged in user
          const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");
          
           res.status(200).json(filteredUsers)
      }catch(error){
            console.error("Error in getUsersForSidebar: ",error.message);
            res.status(500).json({ error:"Internal Server Error"});
      }
};

export const getMessages = async (req,res) => {
    try{
        const { id:userToChatId } = req.params 
        const myId = req.user._id; //myId = senderId

        // Validate if IDs are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userToChatId) || !mongoose.Types.ObjectId.isValid(senderId)) {
          return res.status(400).json({ error: "Invalid user ID format" });
          
      }

        const messages = await Message.find({
          $or:[
            {senderId:myId , receiverId:userToChatId},
            {senderId:userToChatId , receiverId:myId}
          ]
        })

        res.status(200).json(messages)
        
    }catch(error){
          console.log("Error in getMessages controller: ",error.message);
          res.status(500).json({ error : "Internal server Error "});
    }
}

export const sendMessage = async (req,res) => {
    try{
      const {text , image } = req.body;
      const {id:receiverId}= req.params;
      const senderId =  req.user._id;

      let imageUrl;

      if(image){
        //upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });

      await newMessage.save(); // saving to db

      // todo : realtime fucntionlaity => socket.io
      
      res.status(201).json(newMessage);

    }catch(error){
        console.log("Error in sendMessage controller:",error.message);
        res.status(500).json({ error: "Internal Server Error"})
    }

};