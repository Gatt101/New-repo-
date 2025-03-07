import { Image, Send, X, Wand2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import { translateGenZText } from "../lib/gemini";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, transcribedText, setTranscribedText } = useChatStore();

  // Listen for transcribed text changes
  useEffect(() => {
    if (transcribedText) {
      setText(transcribedText);
      setTranscribedText(""); // Reset the transcribed text after using it
    }
  }, [transcribedText, setTranscribedText]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      let translatedText = null;

      if (text.trim()) {
        const analysis = await translateGenZText(text.trim());
        console.log("Translation analysis:", analysis); // Debug log
        if (analysis.translated) {
          translatedText = analysis.translated;
        }
      }

      console.log("Sending message with translation:", translatedText); // Debug log

      const messageData = {
        text: text.trim(),
        image: imagePreview,
        translatedText: translatedText
      };

      await sendMessage(messageData);

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message: ", error);
      toast.error("Failed to send message");
    }
  };

  const handleTranslateText = async () => {
    if (!text.trim()) return;

    try {
      setIsTranslating(true);
      const { translated } = await translateGenZText(text);
      setText(translated);
      toast.success("Text translated for better understanding!");
    } catch (error) {
      toast.error("Failed to translate text");
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="button"
            onClick={handleTranslateText}
            className={`btn btn-sm btn-circle ${isTranslating ? 'loading' : ''}`}
            disabled={!text.trim() || isTranslating}
            title="Translate to formal language"
          >
            <Wand2 size={20} />
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500 " : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
