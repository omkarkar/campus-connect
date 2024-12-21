import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, ChatRoom } from '../../types';

interface ChatState {
  messages: Record<string, ChatMessage[]>; // chatRoomId -> messages
  chatRooms: ChatRoom[];
  currentRoomId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: {},
  chatRooms: [],
  currentRoomId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      state.chatRooms = action.payload;
    },
    addChatRoom: (state, action: PayloadAction<ChatRoom>) => {
      state.chatRooms.push(action.payload);
      state.messages[action.payload.id] = [];
    },
    setCurrentRoom: (state, action: PayloadAction<string>) => {
      state.currentRoomId = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ roomId: string; messages: ChatMessage[] }>) => {
      state.messages[action.payload.roomId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { chatRoomId } = action.payload;
      if (!state.messages[chatRoomId]) {
        state.messages[chatRoomId] = [];
      }
      state.messages[chatRoomId].push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { chatRoomId } = action.payload;
      const messageIndex = state.messages[chatRoomId]?.findIndex(
        msg => msg.id === action.payload.id
      );
      if (messageIndex !== undefined && messageIndex !== -1) {
        state.messages[chatRoomId][messageIndex] = action.payload;
      }
    },
    deleteMessage: (state, action: PayloadAction<{ roomId: string; messageId: string }>) => {
      const { roomId, messageId } = action.payload;
      if (state.messages[roomId]) {
        state.messages[roomId] = state.messages[roomId].filter(msg => msg.id !== messageId);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChatRooms,
  addChatRoom,
  setCurrentRoom,
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;
