import { type Decorator } from '@storybook/react-vite';
import { IconsProvider } from 'clientvault-ui/display';

export const IconsProviderDecorator: Decorator = (Story) => {
  return (
    <IconsProvider>
      <Story />
    </IconsProvider>
  );
};
