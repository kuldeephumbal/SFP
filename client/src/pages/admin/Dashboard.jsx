import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
  ButtonGroup,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
  YouTube
} from '@mui/icons-material';
import api from '../../components/BaseURL';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Bar,
  Line,
  Doughnut,
  Pie
} from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);

  const stats = [
    {
      title: '26K',
      subtitle: 'Users',
      change: '-12.4%',
      trend: 'down',
      color: '#8b5cf6',
      chartColor: '#a78bfa'
    },
    {
      title: '$6.200',
      subtitle: 'Income',
      change: '40.9%',
      trend: 'up',
      color: '#3b82f6',
      chartColor: '#60a5fa'
    },
    {
      title: '2.49%',
      subtitle: 'Conversion Rate',
      change: '84.7%',
      trend: 'up',
      color: '#f59e0b',
      chartColor: '#fbbf24'
    },
    {
      title: '44K',
      subtitle: 'Sessions',
      change: '-23.6%',
      trend: 'down',
      color: '#ef4444',
      chartColor: '#f87171'
    }
  ];

  const ChartComponent = ({ type, data, options, title, docsLink }) => {
    const getChartComponent = () => {
      switch (type) {
        case 'bar':
          return <Bar data={data} options={options} />;
        case 'line':
          return <Line data={data} options={options} />;
        case 'doughnut':
          return <Doughnut data={data} options={options} />;
        case 'pie':
          return <Pie data={data} options={options} />;
        default:
          return null;
      }
    };

    return (
      <Paper sx={{
        p: { xs: 1.5, sm: 3 },
        height: { xs: 320, sm: 400 },
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: { xs: '16px', sm: '20px' },
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        width: '100%',
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1, sm: 2 } }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
            {title}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            href={docsLink}
            target="_blank"
            sx={{ textTransform: 'none', display: { xs: 'none', sm: 'inline-flex' } }}
          >
            docs
          </Button>
        </Box>
        <Box sx={{ height: { xs: 265, sm: 300 }, width: '100%' }}>
          {getChartComponent()}
        </Box>
      </Paper>
    );
  };

  const chartData = {
    barChart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'GitHub Commits',
          data: [40, 20, 12, 39, 10, 40, 39, 50, 60, 70, 80, 75],
          backgroundColor: '#3E84F6',
          borderColor: '#ffffff',
          borderWidth: 1
        }
      ]
    },
    lineChart: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          data: [50, 40, 60, 35, 95, 5, 10],
          borderColor: '#36a2eb',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.1
        },
        {
          label: 'My Second dataset',
          data: [20, 50, 35, 45, 35, 85, 75],
          borderColor: '#4bc0c0',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.1
        }
      ]
    },
    doughnutChart: {
      labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
      datasets: [
        {
          data: [40, 20, 20, 20],
          backgroundColor: ['#769FCD', '#FCE38A', '#95E1D3', '#F38181']
        }
      ]
    },
    pieChart: {
      labels: ['Red', 'Green', 'Yellow'],
      datasets: [
        {
          data: [40, 30, 30],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    let videoId = '';
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  useEffect(() => {
    setVideosLoading(true);
    api
      .get('/youtube-video')
      .then((res) => setYoutubeVideos(res.data || []))
      .catch((err) => {
        console.error('Failed to load youtube videos', err);
        setYoutubeVideos([]);
      })
      .finally(() => setVideosLoading(false));
  }, []);

  const StatCard = ({ stat }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.chartColor}25 100%)`,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: { xs: '16px', sm: '20px' },
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        height: { xs: 120, sm: 140 },
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${stat.color}40 0%, ${stat.chartColor}60 100%)`,
          zIndex: -1
        },
        '&:hover': {
          transform: 'translateY(-5px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0, pr: 0.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 0.5,
                fontSize: { xs: '1.25rem', sm: '2rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {stat.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {stat.subtitle}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 0.5, sm: 1 } }}>
              {stat.trend === 'up' ? (
                <TrendingUp sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
              )}
              <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                ({stat.change})
              </Typography>
            </Box>
          </Box>
          <IconButton sx={{ color: 'white', flexShrink: 0, p: { xs: 0.5, sm: 1 } }}>
            <MoreVert sx={{ fontSize: { xs: 18, sm: 24 } }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '60%',
            height: '50%',
            opacity: 0.2,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 100%)',
            borderRadius: '50% 0 0 0',
            filter: 'blur(1px)'
          }}
        />

        {/* Additional glass effect elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '30px',
            height: '30px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '10px',
            width: '15px',
            height: '15px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            filter: 'blur(1px)'
          }}
        />
      </CardContent>
    </Card>
  );

  return (
    <>
      <CustomBreadcrumb />
      <Box sx={{ width: '100%', px: { xs: 0.5, sm: 2 }, py: { xs: 1, sm: 2 } }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: { xs: 1.5, sm: 2 },
          mb: { xs: 2, sm: 3 }
        }}>
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' },
          gap: { xs: 1.5, sm: 2 }
        }}>
          <Box sx={{ gridColumn: { xs: '1', lg: 'span 8' } }}>
            <ChartComponent
              type="bar"
              data={chartData.barChart}
              title="Bar Chart"
              docsLink="#"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 80
                  }
                }
              }}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1', lg: 'span 4' } }}>
            <ChartComponent
              type="doughnut"
              data={chartData.doughnutChart}
              title="Doughnut Chart"
              docsLink="#"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom'
                  }
                }
              }}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1', lg: 'span 4' } }}>
            <ChartComponent
              type="pie"
              data={chartData.pieChart}
              title="Pie Chart"
              docsLink="#"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom'
                  }
                }
              }}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: '1', lg: 'span 8' } }}>
            <ChartComponent
              type="line"
              data={chartData.lineChart}
              title="Line Chart"
              docsLink="#"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </Box>
        </Box>

        <Box sx={{
          mt: { xs: 2, sm: 3 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
          gap: { xs: 1.5, sm: 2 }
        }}>
          {videosLoading && (
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: { xs: '16px', sm: '20px' },
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              minHeight: 260
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                  Loading YouTube videos...
                </Typography>
              </CardContent>
            </Card>
          )}

          {!videosLoading && youtubeVideos.length === 0 && (
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: { xs: '16px', sm: '20px' },
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
              minHeight: 260
            }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                <YouTube sx={{ fontSize: 40, color: '#ef4444', mb: 1 }} />
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 0.5 }}>
                  No YouTube videos yet
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Add videos from the YouTube Videos page to see them here.
                </Typography>
              </CardContent>
            </Card>
          )}

          {!videosLoading && youtubeVideos.slice(0, 6).map((video) => (
            <Card
              key={video._id || video.id}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: { xs: '16px', sm: '20px' },
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ position: 'relative', paddingTop: '56.25%', background: '#0f172a' }}>
                  {getEmbedUrl(video.url) && (
                    <Box
                      component="iframe"
                      src={getEmbedUrl(video.url)}
                      title={video.url}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 0
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, mr: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {video.url}
                  </Typography>
                  <YouTube sx={{ color: '#ef4444' }} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
