// Icons
import {
  Article,
  ReportGmailerrorred as PanicIcon,
  Gavel as JudgementIcon,
  Google as GoogleIcon,
  BackupTable as ContextStackerIcon,
  Savings as SavingsIcon,
  Forum as TalkIcon,
} from '@mui/icons-material';

// Components
import { Chat } from './wireframes/chat/Chat';
import { Office } from './components/Office';
import { Bank } from './components/Banksy';
import { Index as ContextStacker } from './wireframes/context-stacking/Index';
import { Loading } from './components/Loading';
import { Talk } from './components/Talk';
import { KungFury } from './components/KungFury';

export const routes = [
  {
    route: '/panic',
    path: '/panic',
    icon: PanicIcon,
    text: 'Panic',
    component: Loading,
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
    route: '/bank',
    path: '/bank',
    icon: SavingsIcon,
    text: 'Bank',
    component: Bank,
  },
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
