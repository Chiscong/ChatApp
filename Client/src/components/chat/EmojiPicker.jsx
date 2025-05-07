import { useState } from 'react';
import EmojiPickerReact from 'emoji-picker-react';

const EmojiPicker = ({ onEmojiSelect }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleEmojiClick = (emojiData) => {
        onEmojiSelect(emojiData.emoji);
        setShowPicker(false);
    };

    return (
        <div className="emoji-picker-container">
            <button 
                className="emoji-button"
                onClick={() => setShowPicker(!showPicker)}
            >
                😊
            </button>
            {showPicker && (
                <div className="emoji-picker-wrapper">
                    <EmojiPickerReact
                        onEmojiClick={handleEmojiClick}
                        width={300}
                        height={400}
                    />
                </div>
            )}
        </div>
    );
};

export default EmojiPicker; 