import React from 'react';
import { Grid, Box } from '@mui/material';
import QuickActions from './widgets/QuickActions';
import GithubWidget from './widgets/GithubWidget';
import JenkinsWidget from './widgets/JenkinsWidget';
import NotificationPanel from './widgets/NotificationPanel';
import AIInsights from './widgets/AIInsights';
import TeamActivity from './widgets/TeamActivity';
import CalendarWidget from './widgets/CalendarWidget';
import SprintProgress from './widgets/SprintProgress';
import ExecutionChart from './charts/LiveExecutionChart';
import StatusChart from './charts/StatusDistributionChart';
import BuildHistoryChart from './charts/BuildHistoryChart';
import RecentRuns from './widgets/RecentRunsWidget';
import RecentBugs from './widgets/RecentBugsWidget';
import SkeletonCards from '../Common/SkeletonCards';
import SkeletonTable from '../Common/SkeletonTable';

export default function DashboardGrid({ loading, summary, executionTrend, passFailData, bugSeverity, projectHealth, recentRuns, recentBugs, activity }) {
  if (loading) {
    return (
      <Box>
        <SkeletonCards count={4} />
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{xs: 12, md: 6}}>
            <SkeletonTable rows={4} cols={4} />
          </Grid>
          <Grid size={{xs: 12, md: 6}}>
            <SkeletonTable rows={4} cols={4} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Row 1: Charts */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{xs: 12, md: 6}}>
          <ExecutionChart data={executionTrend} />
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <StatusChart data={passFailData} />
        </Grid>
      </Grid>

      {/* Row 2: Build History & AI Insights */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{xs: 12, md: 8}}>
          <BuildHistoryChart />
        </Grid>
        <Grid size={{xs: 12, md: 4}}>
          <AIInsights />
        </Grid>
      </Grid>

      {/* Row 3: Sprint Progress, Team Activity, Calendar */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{xs: 12, md: 4}}>
          <SprintProgress />
        </Grid>
        <Grid size={{xs: 12, md: 4}}>
          <TeamActivity />
        </Grid>
        <Grid size={{xs: 12, md: 4}}>
          <CalendarWidget />
        </Grid>
      </Grid>

      {/* Row 4: Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{xs: 12, md: 6}}>
          <RecentRuns runs={recentRuns} />
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <RecentBugs bugs={recentBugs} />
        </Grid>
      </Grid>

      {/* Row 5: Quick Actions & CI/CD */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{xs: 12, md: 6}}>
          <QuickActions />
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <JenkinsWidget />
        </Grid>
      </Grid>

      {/* Row 6: GitHub & Notifications */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{xs: 12, md: 6}}>
          <GithubWidget />
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <NotificationPanel />
        </Grid>
      </Grid>
    </Box>
  );
}
