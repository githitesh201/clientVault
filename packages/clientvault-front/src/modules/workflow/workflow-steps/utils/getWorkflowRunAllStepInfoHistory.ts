import { isArray } from '@sniptt/guards';
import { type WorkflowRunStepInfo } from 'clientvault-shared/workflow';

export const getWorkflowRunAllStepInfoHistory = ({
  stepInfo,
}: {
  stepInfo: WorkflowRunStepInfo;
}) => {
  const allStepInfoHistory: WorkflowRunStepInfo[] = [
    ...(isArray(stepInfo?.history) ? stepInfo.history : []),
    stepInfo,
  ];

  return allStepInfoHistory;
};
