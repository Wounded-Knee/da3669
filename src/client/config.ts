import {
  headerText,
  appName,
  WS_SERVER_HOST,
  WS_SERVER_PORT,
  initialState as sharedInitialState,
} from '../shared/config';
import { get } from './lib/LocalStorage';
import { Article, Chat as ChatIcon } from '@mui/icons-material';
import NodeManager from './wireframes/docstore/NodeManager';
import { Chat } from './wireframes/chat/Chat';
import { Office } from './components/Office';
import AtmosphereIcon from '@mui/icons-material/Language';
import JudgementIcon from '@mui/icons-material/Gavel';
import ContextStackerIcon from '@mui/icons-material/BackupTable';
import Atmosphere from './components/Atmosphere';
import SavingsIcon from '@mui/icons-material/Savings';
import { Bank } from './components/Banksy';
import { Index as ContextStacker } from './wireframes/context-stacking/Index';

const localState = get(appName) || { ui: { drawers: {} } };

export const routes = [
  {
    route: '/context',
    path: '/context',
    icon: ContextStackerIcon,
    text: 'Context Stacker',
    component: ContextStacker,
  },
  {
    route: '/chat',
    path: '/chat',
    icon: ChatIcon,
    text: 'Chat',
    component: Chat,
  },
  {
    path: '/nodemanager/:nodeId',
    component: NodeManager,
  },
  {
    route: '/nodemanager',
    path: '/nodemanager',
    icon: Article,
    text: 'Node Manager',
    component: NodeManager,
  },
  {
    route: '/atmosphere',
    path: '/atmosphere',
    icon: AtmosphereIcon,
    text: 'Atmosphere',
    component: Atmosphere,
  },
  {
    path: '/atmosphere/:nodeId',
    component: Atmosphere,
  },
  {
    route: '/judgement',
    path: '/judgement',
    icon: JudgementIcon,
    text: 'Judgement',
    component: Office,
  },
  {
    route: '/bank',
    path: '/bank',
    icon: SavingsIcon,
    text: 'Bank',
    component: Bank,
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

export { appName, headerText, WS_SERVER_PORT, WS_SERVER_HOST };
