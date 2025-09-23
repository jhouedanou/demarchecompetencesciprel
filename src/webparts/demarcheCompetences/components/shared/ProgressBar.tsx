import * as React from 'react';
import {
  Stack,
  Text,
  ProgressIndicator,
  IStackTokens
} from '@fluentui/react';

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  showFraction?: boolean;
  color?: 'blue' | 'green' | 'orange' | 'red';
  size?: 'small' | 'medium' | 'large';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showPercentage = true,
  showFraction = true,
  color = 'blue',
  size = 'medium'
}) => {
  const percentage = total > 0 ? (current / total) : 0;

  const getColorStyle = () => {
    switch (color) {
      case 'green':
        return '#107c10';
      case 'orange':
        return '#ff8c00';
      case 'red':
        return '#d13438';
      default:
        return '#0078d4';
    }
  };

  const getTokens = (): IStackTokens => {
    switch (size) {
      case 'small':
        return { childrenGap: 4 };
      case 'large':
        return { childrenGap: 12 };
      default:
        return { childrenGap: 8 };
    }
  };

  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'medium';
      default:
        return 'mediumPlus';
    }
  };

  const progressText = React.useMemo(() => {
    const parts: string[] = [];

    if (showFraction) {
      parts.push(`${current}/${total}`);
    }

    if (showPercentage) {
      parts.push(`${Math.round(percentage * 100)}%`);
    }

    return parts.join(' • ');
  }, [current, total, percentage, showFraction, showPercentage]);

  return (
    <Stack tokens={getTokens()}>
      {(label || progressText) && (
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          {label && (
            <Text
              variant={getTextVariant()}
              styles={{
                root: {
                  fontWeight: 600
                }
              }}
            >
              {label}
            </Text>
          )}

          {progressText && (
            <Text
              variant={size === 'small' ? 'small' : 'medium'}
              styles={{
                root: {
                  color: '#666666'
                }
              }}
            >
              {progressText}
            </Text>
          )}
        </Stack>
      )}

      <ProgressIndicator
        percentComplete={percentage}
        styles={{
          root: {
            selectors: {
              '.ms-ProgressIndicator-progressTrack': {
                backgroundColor: '#f3f2f1'
              },
              '.ms-ProgressIndicator-progressBar': {
                backgroundColor: getColorStyle()
              }
            }
          }
        }}
      />
    </Stack>
  );
};

export default React.memo(ProgressBar);