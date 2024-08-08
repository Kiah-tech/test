'use client'
import { Box, Button, Stack, TextField, Collapse, Typography } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Kiah-tech support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false); // State to control collapse

  const sendMessage = async () => {
    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])
  
    // Send the message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()  // Get a reader to read the response body
      const decoder = new TextDecoder()  // Create a decoder to decode the response text
  
      let result = ''
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })  // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]  // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1)  // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },  // Append the decoded text to the assistant's message
          ]
        })
        return reader.read().then(processText)  // Continue reading the next chunk of the response
      })
    })
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="black" // Background color
    >
      <Box mb={4}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            sx={{
              background: 'linear-gradient(to right, #4a00e0, #8e2de2, #d53369, #cbad6f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            >
            Welcome to Kiah-Tech AI Customer Support
          </Typography>
        </motion.div>
      </Box>

      {/* <Button 
        variant="contained" 
        onClick={() => setOpen(!open)} 
        style={{ marginBottom: 16 }}
      >
        {open ? 'Hide Messages' : 'Show Messages'}
      </Button> */}

<Button 
  variant="contained" 
  onClick={() => setOpen(!open)} 
  style={{
    marginBottom: 16,
    background: 'linear-gradient(to right, #000428, #004e92, #6a0dad)', // Space-themed gradient with purple
    color: '#fff', // Text color
    padding: '10px 20px',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)', // Glowing effect
    transition: 'background 0.3s, box-shadow 0.3s',
    '&:hover': {
      background: 'linear-gradient(to right, #6a0dad, #004e92, #000428)', // Inverted gradient with purple on hover
      boxShadow: '0 0 20px rgba(255, 255, 255, 1)', // Stronger glow on hover
    }
  }}
>
  {open ? 'Hide Support' : 'Kiah-Tech'}
</Button>


      
<Collapse in={open}>
  <Stack
    direction={'column'}
    width="500px"
    height="700px"
    border="1px solid black"
    p={2}
    spacing={3}
    bgcolor="#ADD8E6" // Light blue background color
    boxShadow="0 0 15px rgba(0, 150, 255, 0.75)" // Glowing effect
    borderRadius={2} // Optional: Rounded corners for a smoother look
  >
    <Stack
      direction={'column'}
      spacing={2}
      flexGrow={1}
      overflow="auto"
      maxHeight="100%"
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          display="flex"
          justifyContent={
            message.role === 'assistant' ? 'flex-start' : 'flex-end'
          }
        >
          <Box
            bgcolor={
              message.role === 'assistant'
                ? 'primary.main'
                : 'secondary.main'
            }
            color="white"
            borderRadius={16}
            p={3}
          >
            {message.content}
          </Box>
        </Box>
      ))}
    </Stack>
    <Stack direction={'row'} spacing={2}>
      <TextField
        label="Message"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button 
        variant="contained" 
        onClick={sendMessage}
        style={{
          marginBottom: 16,
          background: 'linear-gradient(to right, #000428, #004e92, #6a0dad)', // Space-themed gradient with purple
          color: '#fff', // Text color
          padding: '10px 20px',
          borderRadius: '12px',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)', // Glowing effect
          transition: 'background 0.3s, box-shadow 0.3s',
          '&:hover': {
            background: 'linear-gradient(to right, #6a0dad, #004e92, #000428)', // Inverted gradient with purple on hover
            boxShadow: '0 0 20px rgba(255, 255, 255, 1)', // Stronger glow on hover
          }
        }}
        >
        Send
      </Button>
    </Stack>
  </Stack>
</Collapse>

      
    </Box>
  );
}
