import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '../services/api';
import { MapPin, Calendar, Tag, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const HomeShadcn = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0
  });

  useEffect(() => {
    fetchRecentReports();
    fetchStats();
  }, []);

  const fetchRecentReports = async () => {
    try {
      const response = await api.get('/reports/recent');
      setRecentReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/reports');
      const reports = response.data.reports || [];
      setStats({
        total: reports.length,
        completed: reports.filter(r => r.status === 'completed').length,
        inProgress: reports.filter(r => r.status === 'in_progress').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: 'warning', label: 'Menunggu' },
      approved: { variant: 'info', label: 'Disetujui' },
      assigned: { variant: 'default', label: 'Ditugaskan' },
      in_progress: { variant: 'secondary', label: 'Dalam Proses' },
      completed: { variant: 'success', label: 'Selesai' },
      rejected: { variant: 'destructive', label: 'Ditolak' }
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bersama Wujudkan
            <span className="text-primary-500"> Lingkungan Bersih</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Laporkan sampah liar di sekitar Anda dan bantu kami menciptakan kota yang lebih bersih dan sehat
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/buat-laporan">Buat Laporan</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/laporan">Lihat Laporan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Laporan terdaftar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Sampah terangkut</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Sedang ditangani</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Laporan Terbaru
          </h2>
          
          {recentReports.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Belum ada laporan</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      {getStatusBadge(report.status)}
                    </div>
                    <CardTitle className="text-lg">{report.location}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-4">
                      {report.description}
                    </CardDescription>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span className="capitalize">{report.category?.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(report.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeShadcn;

