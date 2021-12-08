import { Article, ReportGmailerrorred as PanicIcon } from '@mui/icons-material';
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
import { Loading } from './components/Loading';
import { Index as Experiment1 } from './wireframes/experiment1/Index';
import ExperimentIcon from '@mui/icons-material/Science';

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
