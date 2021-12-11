// Icons
import {
  Article,
  ReportGmailerrorred as PanicIcon,
  Language as AtmosphereIcon,
  Gavel as JudgementIcon,
  Google as GoogleIcon,
  BackupTable as ContextStackerIcon,
  Savings as SavingsIcon,
  Science as ExperimentIcon,
} from '@mui/icons-material';

// Components
import NodeManager from './wireframes/docstore/NodeManager';
import { Chat } from './wireframes/chat/Chat';
import { Office } from './components/Office';
import Atmosphere from './components/Atmosphere';
import { Bank } from './components/Banksy';
import { Index as ContextStacker } from './wireframes/context-stacking/Index';
import { Loading } from './components/Loading';
import { Index as Experiment1 } from './wireframes/experiment1/Index';

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
    path: '/experiment1/:nodeId',
    component: Experiment1,
  },
  {
    route: '/experiment1',
    path: '/experiment1',
    icon: ExperimentIcon,
    text: 'Experiment 1',
    component: Experiment1,
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
  //   route: '/atmosphere',
  //   path: '/atmosphere',
  //   icon: AtmosphereIcon,
  //   text: 'Atmosphere',
  //   component: Atmosphere,
  // },
  // {
  //   path: '/atmosphere/:nodeId',
  //   component: Atmosphere,
  // },
  // {
  //   route: '/judgement',
  //   path: '/judgement',
  //   icon: JudgementIcon,
  //   text: 'Judgement',
  //   component: Office,
  // },
  // {
  //   route: '/bank',
  //   path: '/bank',
  //   icon: SavingsIcon,
  //   text: 'Bank',
  //   component: Bank,
  // },
  {
    route: '/google',
    path: '/google',
    icon: GoogleIcon,
    text: 'Login',
    express: true,
    component: Loading,
  },
];
