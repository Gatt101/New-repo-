// React Component (Navbar.js)
import { LogOut, MessageSquare, Settings, User, Newspaper, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { sendMessage, selectedUser, setTranscribedText } = useChatStore();
  const [isListening, setIsListening] = useState(false);

  // Initialize speech recognition
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechRecognition = new recognition();

  speechRecognition.lang = "en-US";
  speechRecognition.continuous = false;
  speechRecognition.interimResults = false;

  const handleSpeechClick = () => {
    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      speechRecognition.start();
      setIsListening(true);
    }
  };

  speechRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("Transcribed text:", transcript);
    setTranscribedText(transcript); // This will update the MessageInput
    setIsListening(false);
  };

  speechRecognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    setIsListening(false);
  };

  const handleSendMessage = async (messageText) => {
    if (!selectedUser?._id) {
      console.error("No user selected");
      return;
    }

    try {
      await sendMessage({
        text: messageText,
      });
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chat iT ;</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            <Link to="/news" className="btn btn-sm gap-2 transition-colors">
              <Newspaper className="w-4 h-4" />
              <span className="hidden sm:inline">News</span>
            </Link>

            <button
              onClick={handleSpeechClick}
              className={`btn btn-sm gap-2 ${isListening ? 'btn-primary animate-pulse' : ''}`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Voice'}</span>
            </button>

            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;