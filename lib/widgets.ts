import { irlHudWidget } from './widgets_config/irlHud';
import { miniMapWidget } from './widgets_config/miniMap';
import { followerGoalWidget } from './widgets_config/followerGoal';
import { subGoalWidget } from './widgets_config/subGoal';
import { goalBarWidget } from './widgets_config/goalBar';
import { chatOverlayWidget } from './widgets_config/chatOverlay';
import { subCounterWidget } from './widgets_config/subCounter';
import { nowPlayingWidget } from './widgets_config/nowPlaying';
import { qrTipWidget } from './widgets_config/qrTip';
import { WidgetDef, WidgetField, WidgetOption } from './widgets_config/types';

export type { WidgetDef, WidgetField, WidgetOption };

export const WIDGETS_LIST: WidgetDef[] = [
  irlHudWidget,
  miniMapWidget,
  followerGoalWidget,
  subGoalWidget,
  goalBarWidget,
  chatOverlayWidget,
  subCounterWidget,
  nowPlayingWidget,
  qrTipWidget,
];
