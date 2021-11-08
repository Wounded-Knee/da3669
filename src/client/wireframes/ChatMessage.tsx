import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
const { useState } = React;

export const ChatMessage: React.FunctionComponent = ({ messages, author }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {messages.map((message, index) => (
        <ListItem
          button
          selected={selectedIndex === index}
          key={index}
          alignItems='flex-start'
          onClick={() => setSelectedIndex(index)}
        >
          <ListItemText primary={message} />
        </ListItem>
      ))}
    </List>
  );
};
