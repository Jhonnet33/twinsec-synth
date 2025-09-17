import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  Play, 
  Settings, 
  Shield, 
  Network,
  Activity,
  Gauge,
  AlertTriangle
} from "lucide-react";

interface ModelData {
  name: string;
  type: string;
  components: Array<{
    id: string;
    kind: string;
    params: Record<string, any>;
  }>;
  connections: Array<{
    from: string;
    to: string;
    signal?: string;
  }>;
  signals: {
    inputs?: string[];
    outputs?: string[];
    states?: string[];
  };
  solver: {
    method: string;
    dt: number;
  };
  hmi?: {
    widgets: Array<{
      kind: string;
      bind: string;
    }>;
  };
}

interface ModelViewerProps {
  model: ModelData | null;
  onStartSimulation: () => void;
}

export function ModelViewer({ model, onStartSimulation }: ModelViewerProps) {
  if (!model) {
    return (
      <Card className="shadow-panel border-border/50 h-full flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No model generated yet</p>
          <p className="text-sm">Use the prompt editor to create a digital twin</p>
        </CardContent>
      </Card>
    );
  }

  const getComponentIcon = (kind: string) => {
    switch (kind) {
      case 'tank': return '🛢️';
      case 'valve': return '🔧';
      case 'sensor_level': return '📏';
      case 'pump': return '⚡';
      case 'motor': return '🔌';
      case 'battery': return '🔋';
      case 'solar': return '☀️';
      default: return '⚙️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tank': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'microgrid_dc': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'drone': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Model Header */}
      <Card className="shadow-panel border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5 text-primary" />
                <span>{model.name}</span>
                <Badge className={`${getTypeColor(model.type)} text-xs`}>
                  {model.type.toUpperCase()}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Solver: {model.solver.method} | dt: {model.solver.dt}s
              </p>
            </div>
            <Button 
              onClick={onStartSimulation}
              className="gradient-safe text-white hover:shadow-cyber"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Simulation
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Components */}
      <Card className="shadow-panel border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-accent" />
            <span>Components ({model.components.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {model.components.map((component, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-secondary/50 border border-border/30"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getComponentIcon(component.kind)}</span>
                  <div>
                    <p className="font-medium text-sm">{component.id}</p>
                    <p className="text-xs text-muted-foreground">{component.kind}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {Object.entries(component.params).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connections */}
      <Card className="shadow-panel border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-primary" />
            <span>Signal Connections ({model.connections.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {model.connections.map((connection, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-2 rounded bg-muted/30 text-sm font-mono"
              >
                <span className="text-sensor-green">{connection.from}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-actuator-blue">{connection.to}</span>
                {connection.signal && (
                  <Badge variant="outline" className="text-xs">
                    {connection.signal}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Signals & HMI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-panel border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-warning" />
              <span>Signals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {model.signals.outputs && (
              <div>
                <p className="text-sm font-medium mb-2">Outputs:</p>
                <div className="space-y-1">
                  {model.signals.outputs.map((signal, index) => (
                    <div key={index} className="text-xs font-mono bg-muted/30 p-1 rounded">
                      {signal}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {model.signals.inputs && (
              <div>
                <p className="text-sm font-medium mb-2">Inputs:</p>
                <div className="space-y-1">
                  {model.signals.inputs.map((signal, index) => (
                    <div key={index} className="text-xs font-mono bg-muted/30 p-1 rounded">
                      {signal}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {model.hmi && (
          <Card className="shadow-panel border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gauge className="h-5 w-5 text-industrial-orange" />
                <span>HMI Widgets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {model.hmi.widgets.map((widget, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"
                  >
                    <span className="font-mono">{widget.bind}</span>
                    <Badge variant="outline" className="text-xs">
                      {widget.kind}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}