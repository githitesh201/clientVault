import { useReactFlow } from '@xyflow/react';
import { isDefined } from 'clientvault-shared/utils';
import { THEME_COMMON } from 'clientvault-ui/theme';

export const useWorkflowDiagramScreenToFlowPosition = () => {
  const { screenToFlowPosition } = useReactFlow();

  const workflowDiagramScreenToFlowPosition = (position?: {
    x: number;
    y: number;
  }) => {
    if (!isDefined(position)) {
      return;
    }

    const visibleRightDrawerWidth = Number(
      THEME_COMMON.rightDrawerWidth.replace('px', ''),
    );

    const flowPosition = screenToFlowPosition(position);

    return {
      x: flowPosition.x + visibleRightDrawerWidth / 2,
      y: flowPosition.y,
    };
  };

  return { workflowDiagramScreenToFlowPosition };
};
