import React, { useState } from 'react';
import { ImageList, ImageListItem, ListSubheader, ImageListItemBar } from '@mui/material';
import { Link } from '../../components/Branded';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { Button, Input } from '../../components/Branded';

const ImageListBranded = ({ subheader, items }) => (
  <ImageList>
    <ImageListItem key='Subheader' cols={2}>
      <ListSubheader component='div'>{subheader}</ListSubheader>
    </ImageListItem>
    {items.map((item) => (
      <Link key={item.img} to={`/collective-soul/${item.id}`}>
        <ImageListItem>
          <img src={`${item.img}`} srcSet={`${item.img}`} alt={item.title} loading='lazy' />
          <ImageListItemBar title={item.title} subtitle={item.author} />
        </ImageListItem>
      </Link>
    ))}
  </ImageList>
);

const GroupList = () => (
  <ImageListBranded subheader='Groups' items={useSelector(({ ui: { collectiveSoul } }) => collectiveSoul.groups)} />
);

const ConversationList = ({ group }) => {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <ImageListBranded
        subheader={group}
        items={useSelector(({ ui: { collectiveSoul } }) =>
          collectiveSoul.conversations.filter(({ groups }) => groups.includes(group)),
        )}
      />

      {showCreate ? (
        <>
          <Input />
          <Input />
          <Button onClick={() => setShowCreate(false)}>Save</Button>{' '}
        </>
      ) : (
        <Button onClick={() => setShowCreate(true)}>Create New</Button>
      )}
    </>
  );
};

export const Groups = () => {
  const { group } = useParams();

  return !group ? <GroupList /> : <ConversationList group={group} />;
};
