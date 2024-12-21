import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  IconButton,
  Divider,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addMessage, setCurrentRoom } from '../../store/slices/chatSlice';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, ChatRoom } from '../../types';

const Chat: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const chatRooms = useAppSelector((state) => state.chat.chatRooms);
  const currentRoomId = useAppSelector((state) => state.chat.currentRoomId);
  const messages = useAppSelector((state) => 
    currentRoomId ? state.chat.messages[currentRoomId] : []
  );

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io('http://localhost:3001'); // Replace with your Socket.IO server URL

    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
    });

    socketRef.current.on('message', (message: ChatMessage) => {
      dispatch(addMessage(message));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [dispatch]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && currentRoomId && user) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: user.id,
        chatRoomId: currentRoomId,
        createdAt: new Date().toISOString(),
      };

      socketRef.current?.emit('message', message);
      dispatch(addMessage(message));
      setNewMessage('');
    }
  };

  const getChatIcon = (type: ChatRoom['type']) => {
    switch (type) {
      case 'course':
        return <GroupIcon />;
      case 'assignment':
        return <AssignmentIcon />;
      case 'direct':
        return <PersonIcon />;
      default:
        return <GroupIcon />;
    }
  };

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 100px)' }}>
      {/* Chat Rooms List */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ height: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Divider />
          <List sx={{ overflow: 'auto', height: 'calc(100% - 70px)' }}>
            {filteredRooms.map((room) => (
              <ListItem
                button
                key={room.id}
                selected={currentRoomId === room.id}
                onClick={() => dispatch(setCurrentRoom(room.id))}
              >
                <ListItemAvatar>
                  <Avatar>{getChatIcon(room.type)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={room.name}
                  secondary={`${room.participants.length} participants`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Chat Messages */}
      <Grid item xs={12} md={9}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {currentRoomId ? (
            <>
              {/* Messages Container */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {messages?.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  return (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                          color: isOwnMessage ? 'common.white' : 'text.primary',
                          borderRadius: 2,
                          p: 2,
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item>
                    <IconButton
                      color="primary"
                      type="submit"
                      disabled={!newMessage.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Select a chat to start messaging
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Chat;
