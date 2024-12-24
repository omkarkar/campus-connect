import { makeAutoObservable } from 'mobx';
import chatData from '../data/chat.json';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  chatRoomId?: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  messages: Message[];
  lastMessageTimestamp: Date;
  name?: string;
  type?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  online?: boolean;
  lastSeen?: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: string;
  participants: {
    id: string;
    name: string;
  }[];
}

export class ChatStore {
  conversations: Conversation[] = [];
  chatRooms: ChatRoom[] = [];
  users: ChatUser[] = [];
  activeChat: string | null = null;
  messages: Record<string, Message[]> = {};
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadChatData();
  }

  private loadChatData() {
    // Convert chatRooms
    this.chatRooms = chatData.chatRooms;

    // Convert conversations with timestamp conversion
    this.conversations = chatData.conversations.map(conv => ({
      ...conv,
      lastMessageTimestamp: new Date(conv.lastMessageTimestamp),
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));

    // Convert messages record with timestamp conversion
    if (chatData.messages) {
      const convertedMessages: Record<string, Message[]> = {};
      Object.entries(chatData.messages).forEach(([roomId, messages]) => {
        convertedMessages[roomId] = messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      });
      this.messages = convertedMessages;
    }
  }

  get unreadMessageCount() {
    return this.conversations.reduce((total, conv) => 
      total + conv.messages.filter(m => !m.read).length, 0
    );
  }

  getConversationById(id: string) {
    return this.conversations.find(conv => conv.id === id);
  }

  sendMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) {
    const conversation = this.getConversationById(conversationId);
    if (conversation) {
      const newMessage: Message = {
        ...message,
        id: `m${conversation.messages.length + 1}`,
        timestamp: new Date()
      };
      conversation.messages.push(newMessage);
      conversation.lastMessageTimestamp = newMessage.timestamp;

      // Update messages record
      if (!this.messages[conversationId]) {
        this.messages[conversationId] = [];
      }
      this.messages[conversationId].push(newMessage);
    }
  }

  markMessagesAsRead(conversationId: string, senderId: string) {
    const conversation = this.getConversationById(conversationId);
    if (conversation) {
      conversation.messages
        .filter(m => m.senderId !== senderId)
        .forEach(m => { m.read = true; });
    }
  }

  // Placeholder methods to match component usage
  fetchChatRooms() {
    this.loading = false;
  }

  addMessage(message: Partial<Message>) {
    const completeMessage: Message = {
      id: `m${Date.now()}`,
      senderId: message.senderId || '',
      senderName: message.senderName || 'Unknown',
      content: message.content || '',
      timestamp: new Date(),
      read: false,
      chatRoomId: message.chatRoomId
    };

    if (completeMessage.chatRoomId) {
      if (!this.messages[completeMessage.chatRoomId]) {
        this.messages[completeMessage.chatRoomId] = [];
      }
      this.messages[completeMessage.chatRoomId].push(completeMessage);
    }
  }

  setActiveChat(chatId: string) {
    this.activeChat = chatId;
  }
}

export const chatStore = new ChatStore();
export default chatStore;
