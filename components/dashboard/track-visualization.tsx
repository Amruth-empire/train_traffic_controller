import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Route, AlertTriangle, Activity, Wrench } from 'lucide-react';
import { TrackSection, Train } from '@/lib/types';

interface TrackVisualizationProps {
  trackSections: TrackSection[];
  trains: Train[];
  onTrackClick?: (track: TrackSection) => void;
}

export function TrackVisualization({ trackSections, trains, onTrackClick }: TrackVisualizationProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CLEAR':
        return 'bg-green-500/20 border-green-500 dark:bg-green-500/10';
      case 'OCCUPIED':
        return 'bg-red-500/20 border-red-500 dark:bg-red-500/10';
      case 'MAINTENANCE':
        return 'bg-yellow-500/20 border-yellow-500 dark:bg-yellow-500/10';
      case 'BLOCKED':
        return 'bg-red-600/20 border-red-600 dark:bg-red-600/10';
      default:
        return 'bg-muted border-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CLEAR':
        return <Activity className="h-3 w-3 text-green-500" />;
      case 'OCCUPIED':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'MAINTENANCE':
        return <Wrench className="h-3 w-3 text-yellow-500" />;
      case 'BLOCKED':
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getTrainByTrack = (trackId: string) => {
    return trains.find(train => train.occupiedTrack === trackId);
  };

  return (
    <Card className="bg-slate-800 border-slate-700 max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Route className="h-5 w-5 text-white" />
          <span>Track Section Status</span>
          <div className="ml-auto flex space-x-2">
            <Badge variant="outline" className="text-xs !text-white border-white bg-transparent">
              {trackSections.filter(t => t.status === 'CLEAR').length} Clear
            </Badge>
            <Badge variant="secondary" className="text-xs !text-white bg-slate-700 border-slate-600">
              {trackSections.filter(t => t.status === 'OCCUPIED').length} Occupied
            </Badge>
            <Badge variant="outline" className="text-xs !text-white border-yellow-500 bg-yellow-500/10">
              {trackSections.filter(t => t.status === 'MAINTENANCE').length} Maintenance
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Track Layout Visualization */}
        <div className="space-y-6">
          {/* Main Lines */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-white">Main Lines</h4>
            <div className="space-y-3">
              {trackSections.filter(track => track.name.includes('Main')).map((track) => {
                const occupyingTrain = getTrainByTrack(track.id);
                return (
                  <div key={track.id} className="relative">
                    <div
                      className={`h-8 rounded-lg border-2 ${getStatusColor(track.status)} 
                        cursor-pointer hover:opacity-80 transition-all duration-200 relative overflow-hidden`}
                      onClick={() => onTrackClick?.(track)}
                    >
                      {/* Track Label */}
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        {getStatusIcon(track.status)}
                        <span className="text-sm font-medium text-white">
                          {track.name}
                        </span>
                      </div>
                      
                      {/* Track Details */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                        <span className="text-xs text-white">
                          {track.length}m
                        </span>
                        <span className="text-xs text-white">
                          Max: {track.maxSpeed} km/h
                        </span>
                        {occupyingTrain && (
                          <Badge variant="outline" className="text-xs text-white border-white bg-slate-700">
                            {occupyingTrain.number}
                          </Badge>
                        )}
                      </div>

                      {/* Animated indicator for occupied tracks */}
                      {track.status === 'OCCUPIED' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Loop Lines */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-white">Loop Lines</h4>
            <div className="space-y-3">
              {trackSections.filter(track => track.name.includes('Loop')).map((track) => {
                const occupyingTrain = getTrainByTrack(track.id);
                return (
                  <div key={track.id} className="relative">
                    <div
                      className={`h-6 rounded-lg border ${getStatusColor(track.status)} 
                        cursor-pointer hover:opacity-80 transition-all duration-200 relative overflow-hidden`}
                      onClick={() => onTrackClick?.(track)}
                    >
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        {getStatusIcon(track.status)}
                        <span className="text-sm text-white">{track.name}</span>
                      </div>
                      
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <span className="text-xs text-white">{track.length}m</span>
                        {occupyingTrain && (
                          <Badge variant="outline" className="text-xs text-white border-white bg-slate-700">
                            {occupyingTrain.number}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Roads */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-white">Platform Roads</h4>
            <div className="grid grid-cols-2 gap-3">
              {trackSections.filter(track => track.name.includes('Platform')).map((track) => {
                const occupyingTrain = getTrainByTrack(track.id);
                return (
                  <div key={track.id} className="relative">
                    <div
                      className={`h-12 rounded-lg border ${getStatusColor(track.status)} 
                        cursor-pointer hover:opacity-80 transition-all duration-200 p-2`}
                      onClick={() => onTrackClick?.(track)}
                    >
                      <div className="flex items-center justify-between h-full">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(track.status)}
                          <div>
                            <div className="text-sm font-medium text-white">{track.name}</div>
                            <div className="text-xs text-white">{track.length}m</div>
                          </div>
                        </div>
                        
                        {occupyingTrain && (
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs text-white border-white bg-slate-700 mb-1">
                              {occupyingTrain.number}
                            </Badge>
                            <div className="text-xs text-white">
                              {occupyingTrain.name?.split(' ').slice(0, 2).join(' ') || 'Unknown'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Tracks */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Special Tracks</h4>
            <div className="space-y-3">
              {trackSections.filter(track => 
                !track.name.includes('Main') && 
                !track.name.includes('Loop') && 
                !track.name.includes('Platform')
              ).map((track) => {
                const occupyingTrain = getTrainByTrack(track.id);
                return (
                  <div key={track.id} className="relative">
                    <div
                      className={`h-6 rounded-lg border ${getStatusColor(track.status)} 
                        cursor-pointer hover:opacity-80 transition-all duration-200 relative overflow-hidden`}
                      onClick={() => onTrackClick?.(track)}
                    >
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        {getStatusIcon(track.status)}
                        <span className="text-sm text-white">{track.name}</span>
                      </div>
                      
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <span className="text-xs text-white">{track.length}m</span>
                        {occupyingTrain && (
                          <Badge variant="outline" className="text-xs text-white border-white bg-slate-700">
                            {occupyingTrain.number}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className='text-white'>Clear</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className='text-white'>Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className='text-white'>Maintenance</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Route className="h-4 w-4 mr-2" />
              Full Track Diagram
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}