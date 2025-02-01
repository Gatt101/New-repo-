import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";

import { formatMessageTime } from "../lib/utlis";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {

  const   {messages, getMessages , isMessagesLoading 
        , selectedUser , subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

      useEffect(() =>{
      getMessages(selectedUser._id);

      subscribeToMessages();

      return () => unsubscribeFromMessages();

    },[selectedUser._id,getMessages, subscribeToMessages,unsubscribeFromMessages])
   
      useEffect(()=>{
        if(messageEndRef.current && messages){
        messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
      },[messages])
  
  const renderMessage = (message) => {
    const isOwnMessage = message.senderId === authUser._id;
    
    return (
      <div
        key={message._id}
        className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
      >
        <div className="chat-image avatar">
          <div className="size-10 rounded-full border">
            <img
              src={isOwnMessage ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
              alt="profile pic"
            />
          </div>
        </div>
        <div className="chat-header mb-1">
          <time className="text-xs opacity-50">{formatMessageTime(message.createdAt)}</time>
        </div>

        <div className="chat-bubble flex flex-col gap-2 relative">
          {message.image && (
            <img
              src={message.image}
              alt="Attachment"
              className="sm:max-w-[200px] rounded-md mb-2"
            />
          )}
          <div className="flex flex-col gap-2">
            <p className="text-base-content">{message.text}</p>
            
            {message.translatedText && (
              <div className="mt-2 relative">
                <div className="absolute -left-1 top-0 w-0.5 h-full bg-primary/20 rounded"></div>
                <div className="pl-3">
                  <div className="flex items-center gap-2 text-xs text-primary/70 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 8 6 6"/>
                      <path d="m4 14 6 6"/>
                      <path d="M2 5h12"/>
                      <path d="M4 2h12"/>
                      <path d="M3 2v7"/>
                      <path d="M13 2v7"/>
                      <path d="M8 21h12"/>
                      <path d="M10 18h12"/>
                      <path d="M15 12v7"/>
                      <path d="M21 12v7"/>
                    </svg>
                    <span className="font-medium">Translation</span>
                  </div>
                  <p className="text-base-content/80 text-sm">{message.translatedText}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if(isMessagesLoading) 
    return  (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>
      <MessageSkeleton />
      <MessageInput />
    </div>

  )



  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>

       <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
        {messages.map(renderMessage)}
        <div ref={messageEndRef} />
        </div>

      <MessageInput />

    </div>
  )
}

export default ChatContainer;