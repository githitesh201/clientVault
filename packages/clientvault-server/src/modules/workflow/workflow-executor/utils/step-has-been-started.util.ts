import { isDefined } from 'clientvault-shared/utils';
import { StepStatus, type WorkflowRunStepInfos } from 'clientvault-shared/workflow';

export const stepHasBeenStarted = (
  stepId: string,
  stepInfos: WorkflowRunStepInfos,
) => {
  return (
    isDefined(stepInfos[stepId]?.status) &&
    stepInfos[stepId].status !== StepStatus.NOT_STARTED
  );
};
