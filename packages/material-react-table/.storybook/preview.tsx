import React, { useEffect, useState } from 'react';
import { addons } from '@storybook/preview-api';
import { Preview } from '@storybook/react';
import { useDarkMode, DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import '../src/styles/globals.css';

const channel = addons.getChannel();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const [isDark, setDark] = useState(true);

      useEffect(() => {
        const sbRoot = document.getElementsByClassName(
          'sb-show-main',
        )[0] as HTMLElement;
        const htmlElement = document.documentElement;
        
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        
        // Apply dark mode class to html element for Tailwind
        if (isDark) {
          htmlElement.classList.add('dark');
        } else {
          htmlElement.classList.remove('dark');
        }
        
        // Update Storybook background
        if (sbRoot) {
          sbRoot.style.backgroundColor = isDark ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)';
        }
        
        return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
      }, [isDark]);

      useEffect(() => {
        if (process.env.NODE_ENV === 'development') return;
        const script = document.createElement('script');
        script.src = 'https://plausible.io/js/script.js';
        script.setAttribute('data-domain', 'material-react-table.dev');
        script.defer = true;

        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      }, []);

      return (
        <div className="min-h-screen bg-background text-foreground">
          <p className="pb-2 text-sm text-muted-foreground">
            Looking for the main docs site? Click{' '}
            <a
              href="https://www.material-react-table.com"
              target="_blank"
              rel="noopener"
              className="text-primary hover:underline"
            >
              here.
            </a>
          </p>
          <p className="pb-4 text-sm text-muted-foreground">
            View Source code for these examples in the code tab below or{' '}
            <a
              href="https://github.com/KevinVandy/material-react-table/tree/v3/packages/material-react-table/stories/features"
              target="_blank"
              className="text-primary hover:underline"
            >
              here on GitHub.
            </a>
          </p>
          <Story {...context} />
        </div>
      );
    },
  ],
};

export default preview;
