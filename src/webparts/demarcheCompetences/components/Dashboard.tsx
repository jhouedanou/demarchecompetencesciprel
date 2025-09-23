import * as React from 'react';
import { 
  Text, 
  Stack, 
  Pivot,
  PivotItem,
  DefaultButton
} from '@fluentui/react';

import Card from './shared/CardComponent';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useNavigation, useUser, useError, useLoading, useAppContext } from '../contexts/AppContext';
import { SharePointService } from '../services/SharePointService';
import { QuizResult, SondageResponse, DashboardData } from '../types';
import styles from './DemarcheCompetences.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <Card className={styles.statCard}>
    <Card.Section>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16 }}>
        <div className={styles.statIcon}>{icon}</div>
        <Stack>
          <Text variant="small">{title}</Text>
          <Text variant="xxLarge" className={styles.statValue}>
            <strong>{value}</strong>
          </Text>
          {trend && (
            <Text 
              variant="small" 
              className={trend.isPositive ? styles.trendPositive : styles.trendNegative}
            >
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </Text>
          )}
        </Stack>
      </Stack>
    </Card.Section>
  </Card>
);

interface RecentActivityItemProps {
  user: string;
  action: string;
  time: string;
  type: 'quiz' | 'sondage';
}

const RecentActivityItem: React.FC<RecentActivityItemProps> = ({ user, action, time, type }) => (
  <div className={styles.activityItem}>
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
      <div className={`${styles.activityIcon} ${type === 'quiz' ? styles.quizIcon : styles.sondageIcon}`}>
        {type === 'quiz' ? '📊' : '📝'}
      </div>
      <Stack>
        <Text variant="medium"><strong>{user}</strong> {action}</Text>
        <Text variant="small" className={styles.activityTime}>{time}</Text>
      </Stack>
    </Stack>
  </div>
);

const Dashboard: React.FC = () => {
  const { goBack } = useNavigation();
  const { canViewDashboard } = useUser();
  const { setError, clearError } = useError();
  const { setLoading } = useLoading();
  const { context } = useAppContext();
  
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
  const [quizResults, setQuizResults] = React.useState<QuizResult[]>([]);
  const [sondageResponses, setSondageResponses] = React.useState<SondageResponse[]>([]);
  const [selectedPivot, setSelectedPivot] = React.useState<string>('overview');
  
  const sharePointService = React.useMemo(() => new SharePointService(context), [context]);

  React.useEffect(() => {
    if (!canViewDashboard) {
      setError('Vous n\'avez pas les permissions nécessaires pour accéder au tableau de bord.');
      return;
    }

    const loadDashboardData = async () => {
      setLoading(true);
      clearError();
      
      try {
        // Load detailed results first
        const results = await sharePointService.getQuizResults();
        setQuizResults(results);

        // Load sondage responses
        const responses = await sharePointService.getSondageResponses();
        setSondageResponses(responses);

        // Load dashboard analytics
        const dashData = await sharePointService.getDashboardData();
        setDashboardData({
          ...dashData,
          recentResults: results.slice(0, 10) // Add recent results
        });

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Erreur lors du chargement des données du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [sharePointService, canViewDashboard, setError, setLoading, clearError]);

  if (!canViewDashboard) {
    return (
      <div className={styles.noPermissions}>
        <Card>
          <Card.Section>
            <Stack horizontalAlign="center" tokens={{ childrenGap: 24 }}>
              <div className={styles.noPermissionsIcon}>🔒</div>
              <Text variant="xxLarge" block>
                <strong>Accès restreint</strong>
              </Text>
              <Text variant="large" block style={{ textAlign: 'center' }}>
                Le tableau de bord est réservé aux managers et aux responsables RH.
              </Text>
              <DefaultButton 
                text="Retour" 
                onClick={goBack}
                iconProps={{ iconName: 'Back' }}
              />
            </Stack>
          </Card.Section>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const categoryScoresData = dashboardData ? 
    Object.entries(dashboardData.categoryScores).map(([category, score]) => ({
      name: category,
      score: score,
      percentage: Math.round((score / dashboardData.totalParticipants) * 100)
    })) : [];

  const quizScoreDistribution = React.useMemo(() => {
    const distributions = [
      { range: '90-100%', count: 0, color: '#107C10' },
      { range: '75-89%', count: 0, color: '#0078D4' },
      { range: '60-74%', count: 0, color: '#FF8C00' },
      { range: '< 60%', count: 0, color: '#D13438' }
    ];

    quizResults.forEach(result => {
      const percentage = result.Score && result.TotalQuestions ? 
        Math.round((result.Score / (result.TotalQuestions * 10)) * 100) : 0;
      
      if (percentage >= 90) distributions[0].count++;
      else if (percentage >= 75) distributions[1].count++;
      else if (percentage >= 60) distributions[2].count++;
      else distributions[3].count++;
    });

    return distributions;
  }, [quizResults]);

  const recentActivities = React.useMemo(() => {
    const activities: Array<{
      user: string;
      action: string;
      time: string;
      type: 'quiz' | 'sondage';
      date: Date;
    }> = [];

    // Add quiz activities
    quizResults.slice(0, 10).forEach(result => {
      activities.push({
        user: result.UserEmail.split('@')[0],
        action: 'a complété le quiz d\'introduction',
        time: result.CompletedDate.toLocaleDateString(),
        type: 'quiz',
        date: result.CompletedDate
      });
    });

    // Add sondage activities
    sondageResponses.slice(0, 10).forEach(response => {
      activities.push({
        user: response.UserEmail.split('@')[0],
        action: 'a répondu au sondage d\'opinion',
        time: response.SubmittedDate.toLocaleDateString(),
        type: 'sondage',
        date: response.SubmittedDate
      });
    });

    // Sort by date and take the 10 most recent
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }, [quizResults, sondageResponses]);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
          <Stack>
            <Text variant="xxLarge" block>
              <strong>Tableau de Bord</strong>
            </Text>
            <Text variant="large" block>
              Suivi de la démarche compétences chez CIPREL
            </Text>
          </Stack>
          <DefaultButton 
            text="Retour" 
            onClick={goBack}
            iconProps={{ iconName: 'Back' }}
          />
        </Stack>
      </div>

      <Pivot selectedKey={selectedPivot} onLinkClick={(item) => setSelectedPivot(item?.props.itemKey || 'overview')}>
        <PivotItem headerText="Vue d'ensemble" itemKey="overview">
          <div className={styles.dashboardContent}>
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <StatCard
                title="Total Participants"
                value={dashboardData?.totalParticipants || 0}
                icon="👥"
              />
              <StatCard
                title="Score Moyen"
                value={`${Math.round(dashboardData?.averageScore || 0)}%`}
                icon="📊"
              />
              <StatCard
                title="Taux de Complétion"
                value={`${dashboardData?.completionRate || 0}%`}
                icon="✅"
              />
              <StatCard
                title="Réponses Sondage"
                value={sondageResponses.length}
                icon="📝"
              />
            </div>

            {/* Charts Row */}
            <div className={styles.chartsRow}>
              {/* Category Scores */}
              <Card className={styles.chartCard}>
                <Card.Section>
                  <Text variant="large" block>
                    <strong>Scores par Catégorie</strong>
                  </Text>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryScoresData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="percentage" fill="#ff6600" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Section>
              </Card>

              {/* Score Distribution */}
              <Card className={styles.chartCard}>
                <Card.Section>
                  <Text variant="large" block>
                    <strong>Distribution des Scores</strong>
                  </Text>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={quizScoreDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ range, count }) => `${range}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {quizScoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Section>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className={styles.activityCard}>
              <Card.Section>
                <Text variant="large" block style={{ marginBottom: '16px' }}>
                  <strong>Activité Récente</strong>
                </Text>
                {recentActivities.length > 0 ? (
                  <Stack tokens={{ childrenGap: 12 }}>
                    {recentActivities.map((activity, index) => (
                      <RecentActivityItem
                        key={index}
                        user={activity.user}
                        action={activity.action}
                        time={activity.time}
                        type={activity.type}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Text variant="medium">Aucune activité récente</Text>
                )}
              </Card.Section>
            </Card>
          </div>
        </PivotItem>

        <PivotItem headerText="Résultats Quiz" itemKey="quiz">
          <div className={styles.dashboardContent}>
            <Card>
              <Card.Section>
                <Text variant="large" block style={{ marginBottom: '16px' }}>
                  <strong>Résultats détaillés du Quiz d'Introduction</strong>
                </Text>
                
                {quizResults.length > 0 ? (
                  <div className={styles.resultsTable}>
                    {/* Table Header */}
                    <div className={styles.tableHeader}>
                      <div className={styles.tableCell}><strong>Utilisateur</strong></div>
                      <div className={styles.tableCell}><strong>Score</strong></div>
                      <div className={styles.tableCell}><strong>Pourcentage</strong></div>
                      <div className={styles.tableCell}><strong>Date</strong></div>
                      <div className={styles.tableCell}><strong>Durée</strong></div>
                    </div>
                    
                    {/* Table Rows */}
                    {quizResults.map((result, index) => {
                      const percentage = result.Score && result.TotalQuestions ? 
                        Math.round((result.Score / (result.TotalQuestions * 10)) * 100) : 0;
                      const minutes = Math.floor(result.Duration / 60);
                      const seconds = result.Duration % 60;
                      
                      return (
                        <div key={index} className={styles.tableRow}>
                          <div className={styles.tableCell}>{result.UserEmail.split('@')[0]}</div>
                          <div className={styles.tableCell}>{result.Score || 0}</div>
                          <div className={`${styles.tableCell} ${styles.percentageCell}`}>
                            <span className={
                              percentage >= 90 ? styles.excellent :
                              percentage >= 75 ? styles.good :
                              percentage >= 60 ? styles.average : styles.needsImprovement
                            }>
                              {percentage}%
                            </span>
                          </div>
                          <div className={styles.tableCell}>{result.CompletedDate.toLocaleDateString()}</div>
                          <div className={styles.tableCell}>{minutes}m {seconds}s</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Text variant="medium">Aucun résultat de quiz disponible</Text>
                )}
              </Card.Section>
            </Card>
          </div>
        </PivotItem>

        <PivotItem headerText="Réponses Sondage" itemKey="sondage">
          <div className={styles.dashboardContent}>
            <Card>
              <Card.Section>
                <Text variant="large" block style={{ marginBottom: '16px' }}>
                  <strong>Analyse des Réponses du Sondage</strong>
                </Text>
                
                {sondageResponses.length > 0 ? (
                  <Stack tokens={{ childrenGap: 24 }}>
                    {/* Connaissance préalable */}
                    <div className={styles.sondageAnalysis}>
                      <Text variant="mediumPlus" block>
                        <strong>Question 1: Connaissance préalable de la démarche compétence</strong>
                      </Text>
                      <div className={styles.responseDistribution}>
                        {['Oui', 'Non', 'J\'en ai une vague idée'].map(option => {
                          const count = sondageResponses.filter(r => r.Q1_Connaissance === option).length;
                          const percentage = Math.round((count / sondageResponses.length) * 100);
                          return (
                            <div key={option} className={styles.distributionItem}>
                              <Text variant="medium">{option}: {count} ({percentage}%)</Text>
                              <div className={styles.progressBar}>
                                <div 
                                  className={styles.progressFill} 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent responses list */}
                    <div className={styles.recentResponses}>
                      <Text variant="mediumPlus" block style={{ marginBottom: '12px' }}>
                        <strong>Réponses récentes</strong>
                      </Text>
                      {sondageResponses.slice(0, 10).map((response, index) => (
                        <div key={index} className={styles.responseItem}>
                          <Text variant="medium">
                            <strong>{response.UserEmail.split('@')[0]}</strong> - 
                            {response.SubmittedDate.toLocaleDateString()}
                          </Text>
                          <Text variant="small">
                            Connaissance: {response.Q1_Connaissance}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </Stack>
                ) : (
                  <Text variant="medium">Aucune réponse de sondage disponible</Text>
                )}
              </Card.Section>
            </Card>
          </div>
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default Dashboard;
