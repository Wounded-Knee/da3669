import { appName, WS_SERVER_HOST, WS_SERVER_PORT, initialState as sharedInitialState } from '../shared/config';
import { get } from './lib/LocalStorage';
import { Article, Chat as ChatIcon } from '@mui/icons-material';
import DocStore from './wireframes/docstore/DocStore';
import { Chat } from './wireframes/chat/Chat';

const localState = get(appName) || { ui: { drawers: {} } };

export const routes = [
  {
    route: '/chat',
    path: '/chat',
    icon: ChatIcon,
    text: 'Chat',
    component: Chat,
  },
  {
    path: '/docstore/:nodeId',
    component: DocStore,
  },
  {
    route: '/docstore',
    path: '/docstore',
    icon: Article,
    text: 'Doc Store',
    component: DocStore,
  },
];

export const initialState = {
  ...sharedInitialState,
  nodes: [],
  documents: [],
  user: {
    id: null,
  },
  ui: {
    ...localState.ui,
    drawers: {
      info: false,
      data: false,
      ...localState.ui.drawers,
    },
    ready: {
      webSocket: false,
    },
    docStore: {
      currentDoc: {},
    },
    selectedEntityIndex: null,
    selectedEntityHistory: [],
  },
};

export { appName, WS_SERVER_PORT, WS_SERVER_HOST };
