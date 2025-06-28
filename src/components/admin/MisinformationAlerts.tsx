
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MisinformationAlert {
  id: string;
  title: string;
  content: string;
  source_platform?: string;
  severity: string;
  status: string;
  detection_confidence: number;
  tags?: string[];
  created_at: string;
}

interface MisinformationAlertsProps {
  adminRole: string | null;
}

const MisinformationAlerts: React.FC<MisinformationAlertsProps> = ({ adminRole }) => {
  const [alerts, setAlerts] = useState<MisinformationAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('misinformation_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch misinformation alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('misinformation_alerts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Alert status updated to ${status}`,
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert status",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Misinformation Alerts
          </CardTitle>
          <p className="text-sm text-gray-600">
            Monitor and manage detected misinformation in agricultural content
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">Loading alerts...</div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No misinformation alerts found
              </div>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-red-500' :
                  alert.severity === 'high' ? 'border-l-orange-500' :
                  alert.severity === 'medium' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{alert.title}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {alert.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          {alert.source_platform && (
                            <span>Platform: {alert.source_platform}</span>
                          )}
                          <span>Confidence: {Math.round(alert.detection_confidence * 100)}%</span>
                          <span>Detected: {new Date(alert.created_at).toLocaleDateString()}</span>
                        </div>
                        {alert.tags && alert.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {alert.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateAlertStatus(alert.id, 'monitoring')}
                          disabled={alert.status === 'monitoring'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateAlertStatus(alert.id, 'resolved')}
                          disabled={alert.status === 'resolved'}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MisinformationAlerts;
