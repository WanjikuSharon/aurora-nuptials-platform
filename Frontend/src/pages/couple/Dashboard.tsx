import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Heart, 
  Gift, 
  MapPin, 
  Users, 
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useGetCouplesDashboardQuery } from '../../store/api/apiSlice';
import LoadingSkeleton, { CardSkeleton } from '../../components/ui/LoadingSkeleton';

const Dashboard: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: dashboardData, isLoading, error } = useGetCouplesDashboardQuery();

  // Calculate days until wedding
  const getDaysUntilWedding = (weddingDate: string | null) => {
    if (!weddingDate) return null;
    const wedding = new Date(weddingDate);
    const today = new Date();
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilWedding = getDaysUntilWedding(user?.profile?.weddingDate || null);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <LoadingSkeleton variant="text" height="32px" width="300px" className="mb-2" />
            <LoadingSkeleton variant="text" height="20px" width="400px" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CardSkeleton />
            </div>
            <div>
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <div className="text-red-500 mb-4">
              <Clock className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Dashboard
            </h3>
            <p className="text-gray-600 mb-4">
              We're having trouble loading your dashboard. Please try again.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profile = dashboardData?.profile || user?.profile;
  const stats = dashboardData?.stats || {};
  const upcomingEvents = dashboardData?.upcomingEvents || [];
  const weddingProgress = dashboardData?.weddingProgress || {};
  const recentRegistryItems = dashboardData?.recentRegistryItems || [];

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 💕
          </h1>
          <p className="text-gray-600">
            {daysUntilWedding !== null ? (
              daysUntilWedding > 0 ? (
                <>Only {daysUntilWedding} days until your special day!</>
              ) : daysUntilWedding === 0 ? (
                <>Today is your wedding day! Congratulations! 🎉</>
              ) : (
                <>Hope you had an amazing wedding! 💕</>
              )
            ) : (
              <>Let's start planning your dream wedding</>
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-rose-gold/10 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-gold" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalFavorites || 0}</p>
                <p className="text-sm text-gray-600">Favorites</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings || 0}</p>
                <p className="text-sm text-gray-600">Bookings</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.registryItems || 0}</p>
                <p className="text-sm text-gray-600">Registry Items</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {weddingProgress.progressPercentage || 0}%
                </p>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wedding Planning Progress */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Wedding Planning Progress</h2>
                <Link to="/couple/timeline" className="text-rose-gold hover:text-deep-rose">
                  View Timeline <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{weddingProgress.progressPercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-rose-gold h-3 rounded-full transition-all duration-500"
                    style={{ width: `${weddingProgress.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Planning Tasks */}
              <div className="space-y-3">
                {weddingProgress.tasks?.slice(0, 6).map((task: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                      task.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {task.completed && <CheckCircle className="w-3 h-3 text-green-600" />}
                    </div>
                    <span className={`${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.name}
                    </span>
                  </div>
                ))}
              </div>

              {!profile?.weddingDate && (
                <div className="mt-6 p-4 bg-rose-gold/10 rounded-lg">
                  <p className="text-rose-gold font-medium mb-2">Set Your Wedding Date</p>
                  <p className="text-sm text-gray-600 mb-3">
                    Setting your wedding date will help us create a personalized timeline for you.
                  </p>
                  <Link to="/profile" className="btn-primary text-sm">
                    Update Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Bookings */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <Link to="/couple/bookings" className="text-rose-gold hover:text-deep-rose">
                  View All <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </div>

              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((booking: any) => (
                    <div key={booking.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        {booking.venue ? (
                          <MapPin className="w-6 h-6 text-blue-600" />
                        ) : (
                          <Users className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {booking.venue?.name || booking.vendor?.businessName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.eventDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No bookings yet</p>
                  <Link to="/venues" className="btn-primary">
                    Browse Venues
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  to="/venues" 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-rose-gold mr-3" />
                  <span className="font-medium">Find Venues</span>
                </Link>
                <Link 
                  to="/vendors" 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Users className="w-5 h-5 text-rose-gold mr-3" />
                  <span className="font-medium">Browse Vendors</span>
                </Link>
                <Link 
                  to="/couple/registry" 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Gift className="w-5 h-5 text-rose-gold mr-3" />
                  <span className="font-medium">Manage Registry</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Heart className="w-5 h-5 text-rose-gold mr-3" />
                  <span className="font-medium">Update Profile</span>
                </Link>
              </div>
            </div>

            {/* Registry Preview */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Registry</h2>
                <Link to="/couple/registry" className="text-rose-gold hover:text-deep-rose">
                  View All <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </div>

              {recentRegistryItems.length > 0 ? (
                <div className="space-y-3">
                  {recentRegistryItems.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">${item.price}</p>
                      </div>
                      {item.purchased && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Gift className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">No registry items yet</p>
                  <Link to="/couple/registry" className="btn-primary text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Items
                  </Link>
                </div>
              )}
            </div>

            {/* Wedding Details */}
            {profile && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Wedding Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {profile.weddingDate 
                        ? new Date(profile.weddingDate).toLocaleDateString()
                        : 'Not set'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guest Count</p>
                    <p className="font-medium">{profile.guestCount || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-medium">
                      {profile.budget ? `$${profile.budget.toLocaleString()}` : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Theme</p>
                    <p className="font-medium">{profile.theme || 'Not set'}</p>
                  </div>
                </div>
                <Link to="/profile" className="btn-secondary w-full mt-4">
                  Update Details
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;