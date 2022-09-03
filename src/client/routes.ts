// Icons
import {
  Article,
  EmojiEmotions as PanicIcon,
  Gavel as JudgementIcon,
  Google as GoogleIcon,
  BackupTable as ContextStackerIcon,
  Savings as SavingsIcon,
  Forum as TalkIcon,
  ListAlt as DirectoryIcon,
  PlayCircle as PlayerIcon,
  BlurOn as CollectiveSoulIcon,
} from '@mui/icons-material';

// Components
import { Index as ContextStacker } from './wireframes/context-stacking/Index';
import { Panic } from './components/Panic';
import { Talk } from './components/Talk';
import { KungFury } from './components/KungFury';
import { Directory } from './wireframes/directory/Directory';
import { Editor } from './wireframes/node-editor/Editor';
import { Groups } from './wireframes/collective-soul/groups';

export const routes = [
  {
    route: '/panic',
    path: '/panic',
    icon: PanicIcon,
    text: "Don't Panic",
    component: Panic,
  },
  {
    route: '/editor',
    path: '/editor',
    icon: PlayerIcon,
    text: 'Node Editor',
    component: Editor,
  },
  {
    path: '/collective-soul/:group',
    component: Groups,
  },
  {
    route: '/collective-soul',
    path: '/collective-soul',
    icon: CollectiveSoulIcon,
    text: 'Collective Soul',
    component: Groups,
  },
  {
    route: '/context',
    path: '/context',
    icon: ContextStackerIcon,
    text: 'Context Stacker',
    component: ContextStacker,
  },
  {
    path: '/talk/:nodeId',
    component: Talk,
  },
  {
    route: '/talk',
    path: '/talk',
    icon: TalkIcon,
    text: 'Talk',
    component: Talk,
  },
  {
    route: '/directory',
    path: '/directory',
    icon: DirectoryIcon,
    text: 'Directory',
    component: Directory,
  },
  // {
  //   path: '/nodemanager/:nodeId',
  //   component: NodeManager,
  // },
  // {
  //   route: '/nodemanager',
  //   path: '/nodemanager',
  //   icon: Article,
  //   text: 'Node Manager',
  //   component: NodeManager,
  // },
  // {
  //   route: '/judgement',
  //   path: '/judgement',
  //   icon: JudgementIcon,
  //   text: 'Judgement',
  //   component: Office,
  // },
  {
    path: '/google',
    express: true,
  },
  {
    path: '/kungfury',
    route: '/kungfury',
    component: KungFury,
  },
];
