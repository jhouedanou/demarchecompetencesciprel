import * as React from 'react';
import {
  Stack,
  Text,
  IconButton,
  IIconProps,
  CommandBar,
  ICommandBarItemProps,
  PersonaCoin,
  PersonaSize,
  IContextualMenuProps
} from '@fluentui/react';
import { useNavigation, useUser } from '../../contexts/AppContext';

export interface NavigationProps {
  showBackButton?: boolean;
  title?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  showBackButton = false,
  title
}) => {
  const { currentPage, navigateTo, goBack } = useNavigation();
  const { userInfo, canViewDashboard } = useUser();

  const backIcon: IIconProps = { iconName: 'ChevronLeft' };
  const homeIcon: IIconProps = { iconName: 'Home' };
  const dashboardIcon: IIconProps = { iconName: 'BarChartVertical' };
  const quizIcon: IIconProps = { iconName: 'TestBeakerSolid' };
  const surveyIcon: IIconProps = { iconName: 'Survey' };

  const userMenuProps: IContextualMenuProps = {
    items: [
      {
        key: 'userInfo',
        text: userInfo.displayName,
        iconProps: { iconName: 'Contact' },
        disabled: true
      },
      {
        key: 'email',
        text: userInfo.email,
        iconProps: { iconName: 'Mail' },
        disabled: true
      },
      {
        key: 'divider',
        itemType: 1 // Divider
      },
      {
        key: 'preferences',
        text: 'Préférences',
        iconProps: { iconName: 'Settings' },
        onClick: () => {
          // Could navigate to preferences page
        }
      }
    ]
  };

  const getCommandBarItems = (): ICommandBarItemProps[] => {
    const items: ICommandBarItemProps[] = [
      {
        key: 'home',
        text: 'Accueil',
        iconProps: homeIcon,
        onClick: () => navigateTo('landing'),
        className: currentPage === 'landing' ? 'is-selected' : undefined
      }
    ];

    if (canViewDashboard) {
      items.push({
        key: 'dashboard',
        text: 'Tableau de bord',
        iconProps: dashboardIcon,
        onClick: () => navigateTo('dashboard'),
        className: currentPage === 'dashboard' ? 'is-selected' : undefined
      });
    }

    items.push(
      {
        key: 'quiz',
        text: 'Quiz Introduction',
        iconProps: quizIcon,
        onClick: () => navigateTo('quiz'),
        className: currentPage === 'quiz' ? 'is-selected' : undefined
      },
      {
        key: 'survey',
        text: 'Sondage Opinion',
        iconProps: surveyIcon,
        onClick: () => navigateTo('sondage'),
        className: currentPage === 'sondage' ? 'is-selected' : undefined
      }
    );

    return items;
  };

  const getFarItems = (): ICommandBarItemProps[] => {
    return [
      {
        key: 'user',
        text: userInfo.displayName,
        iconOnly: true,
        onRender: () => (
          <PersonaCoin
            text={userInfo.displayName}
            size={PersonaSize.size32}
            initialsColor="blue"
          />
        ),
        subMenuProps: userMenuProps
      }
    ];
  };

  return (
    <Stack>
      <Stack
        horizontal
        verticalAlign="center"
        tokens={{ childrenGap: 16, padding: '12px 16px' }}
        styles={{
          root: {
            backgroundColor: '#0078d4',
            color: 'white',
            minHeight: 48
          }
        }}
      >
        {showBackButton && (
          <IconButton
            iconProps={backIcon}
            title="Retour"
            ariaLabel="Retour"
            onClick={goBack}
            styles={{
              root: {
                color: 'white',
                backgroundColor: 'transparent',
                selectors: {
                  ':hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              }
            }}
          />
        )}

        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
          <Text
            variant="mediumPlus"
            styles={{
              root: {
                color: 'white',
                fontWeight: 600
              }
            }}
          >
            CIPREL - Démarche Compétences
          </Text>

          {title && (
            <>
              <Text
                variant="medium"
                styles={{
                  root: {
                    color: 'rgba(255, 255, 255, 0.8)'
                  }
                }}
              >
                •
              </Text>
              <Text
                variant="medium"
                styles={{
                  root: {
                    color: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                {title}
              </Text>
            </>
          )}
        </Stack>
      </Stack>

      <CommandBar
        items={getCommandBarItems()}
        farItems={getFarItems()}
        styles={{
          root: {
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e1e5e9'
          }
        }}
      />
    </Stack>
  );
};

export default React.memo(Navigation);