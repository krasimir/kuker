import SagaEffectTriggered from './SagaEffectTriggered';
import SagaEffectResolved from './SagaEffectResolved';
import SagaEffectActionDispatched from './SagaEffectActionDispatched';
import SagaEffectCanceled from './SagaEffectCanceled';
import SagaEffectRejected from './SagaEffectRejected';
import ReduxAction from './ReduxAction';
import NewSession from './NewSession';

import onMachineCreated from './onMachineCreated';
import onMachineConnected from './onMachineConnected';
import onMachineDisconnected from './onMachineDisconnected';
import onActionDispatched from './onActionDispatched';
import onActionProcessed from './onActionProcessed';
import onGeneratorStep from './onGeneratorStep';
import onGeneratorEnd from './onGeneratorEnd';
import onGeneratorResumed from './onGeneratorResumed';
import onStateChanged from './onStateChanged';
import onStateWillChange from './onStateWillChange';

export const Handlers = {
  '@saga_effectTriggered': SagaEffectTriggered,
  '@saga_effectResolved': SagaEffectResolved,
  '@saga_actionDispatched': SagaEffectActionDispatched,
  '@saga_effectCancelled': SagaEffectCanceled,
  '@saga_effectRejected': SagaEffectRejected,
  '@redux_ACTION': ReduxAction,
  'NEW_SESSION': NewSession
};

export const StentHandlers = {
  onMachineCreated,
  onMachineConnected,
  onMachineDisconnected,
  onActionDispatched,
  onActionProcessed,
  onGeneratorStep,
  onGeneratorEnd,
  onGeneratorResumed,
  onStateChanged,
  onStateWillChange
};
