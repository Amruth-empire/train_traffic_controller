"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Plus, Trash2, Bell, AlertTriangle, Clock, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { auditLogger } from "@/lib/audit-logger"
import type { AlertRule } from "@/lib/types"

export function ConfigurableAlerts() {
  const { user } = useAuth()
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "rule1",
      name: "High Delay Alert",
      description: "Alert when any train is delayed more than 15 minutes",
      condition: {
        metric: "delay",
        operator: ">",
        threshold: 15,
        duration: 5,
      },
      actions: {
        notify: true,
        escalate: false,
        autoResolve: false,
      },
      isActive: true,
      createdBy: "1",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "rule2",
      name: "Capacity Warning",
      description: "Alert when station capacity exceeds 85%",
      condition: {
        metric: "capacity",
        operator: ">",
        threshold: 85,
        duration: 10,
      },
      actions: {
        notify: true,
        escalate: true,
        autoResolve: false,
      },
      isActive: true,
      createdBy: "2",
      createdAt: new Date("2024-01-20"),
    },
  ])

  const [newRule, setNewRule] = useState<Partial<AlertRule>>({
    name: "",
    description: "",
    condition: {
      metric: "delay",
      operator: ">",
      threshold: 0,
      duration: 5,
    },
    actions: {
      notify: true,
      escalate: false,
      autoResolve: false,
    },
    isActive: true,
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const createAlertRule = () => {
    if (!newRule.name || !user) return

    const rule: AlertRule = {
      id: `rule_${Date.now()}`,
      name: newRule.name,
      description: newRule.description || "",
      condition: newRule.condition!,
      actions: newRule.actions!,
      isActive: newRule.isActive!,
      createdBy: user.id,
      createdAt: new Date(),
    }

    setAlertRules((prev) => [...prev, rule])

    // Log the rule creation
    auditLogger.log(user, "Create Alert Rule", `Created new alert rule: ${rule.name}`, "system")

    // Reset form
    setNewRule({
      name: "",
      description: "",
      condition: {
        metric: "delay",
        operator: ">",
        threshold: 0,
        duration: 5,
      },
      actions: {
        notify: true,
        escalate: false,
        autoResolve: false,
      },
      isActive: true,
    })

    setIsDialogOpen(false)
  }

  const toggleRule = (ruleId: string) => {
    setAlertRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule)))

    if (user) {
      const rule = alertRules.find((r) => r.id === ruleId)
      auditLogger.log(
        user,
        rule?.isActive ? "Disable Alert Rule" : "Enable Alert Rule",
        `${rule?.isActive ? "Disabled" : "Enabled"} alert rule: ${rule?.name}`,
        "system",
      )
    }
  }

  const deleteRule = (ruleId: string) => {
    const rule = alertRules.find((r) => r.id === ruleId)
    setAlertRules((prev) => prev.filter((rule) => rule.id !== ruleId))

    if (user && rule) {
      auditLogger.log(user, "Delete Alert Rule", `Deleted alert rule: ${rule.name}`, "system")
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "delay":
        return <Clock className="h-4 w-4" />
      case "capacity":
        return <Users className="h-4 w-4" />
      case "speed":
        return <AlertTriangle className="h-4 w-4" />
      case "efficiency":
        return <Settings className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case "delay":
        return "minutes"
      case "capacity":
        return "%"
      case "speed":
        return "km/h"
      case "efficiency":
        return "%"
      default:
        return ""
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            Configurable Alerts ({alertRules.length})
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                New Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Create Alert Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Rule Name</Label>
                  <Input
                    value={newRule.name}
                    onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., High Delay Alert"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Description</Label>
                  <Input
                    value={newRule.description}
                    onChange={(e) => setNewRule((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe when this alert should trigger"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-slate-300">Metric</Label>
                    <Select
                      value={newRule.condition?.metric}
                      onValueChange={(value: any) =>
                        setNewRule((prev) => ({
                          ...prev,
                          condition: { ...prev.condition!, metric: value },
                        }))
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="delay">Delay</SelectItem>
                        <SelectItem value="capacity">Capacity</SelectItem>
                        <SelectItem value="speed">Speed</SelectItem>
                        <SelectItem value="efficiency">Efficiency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Operator</Label>
                    <Select
                      value={newRule.condition?.operator}
                      onValueChange={(value: any) =>
                        setNewRule((prev) => ({
                          ...prev,
                          condition: { ...prev.condition!, operator: value },
                        }))
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value=">">Greater than</SelectItem>
                        <SelectItem value="<">Less than</SelectItem>
                        <SelectItem value=">=">Greater or equal</SelectItem>
                        <SelectItem value="<=">Less or equal</SelectItem>
                        <SelectItem value="=">Equal to</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Threshold</Label>
                    <Input
                      type="number"
                      value={newRule.condition?.threshold}
                      onChange={(e) =>
                        setNewRule((prev) => ({
                          ...prev,
                          condition: { ...prev.condition!, threshold: Number.parseFloat(e.target.value) },
                        }))
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={newRule.condition?.duration}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        condition: { ...prev.condition!, duration: Number.parseInt(e.target.value) },
                      }))
                    }
                    placeholder="How long condition must persist"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-300">Actions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Send Notification</span>
                      <Switch
                        checked={newRule.actions?.notify}
                        onCheckedChange={(checked) =>
                          setNewRule((prev) => ({
                            ...prev,
                            actions: { ...prev.actions!, notify: checked },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Escalate to Supervisor</span>
                      <Switch
                        checked={newRule.actions?.escalate}
                        onCheckedChange={(checked) =>
                          setNewRule((prev) => ({
                            ...prev,
                            actions: { ...prev.actions!, escalate: checked },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Auto-resolve when condition clears</span>
                      <Switch
                        checked={newRule.actions?.autoResolve}
                        onCheckedChange={(checked) =>
                          setNewRule((prev) => ({
                            ...prev,
                            actions: { ...prev.actions!, autoResolve: checked },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button onClick={createAlertRule} disabled={!newRule.name} className="bg-blue-600 hover:bg-blue-700">
                    Create Rule
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="active" className="text-slate-300">
              Active Rules
            </TabsTrigger>
            <TabsTrigger value="all" className="text-slate-300">
              All Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3">
            {alertRules
              .filter((rule) => rule.isActive)
              .map((rule) => (
                <div
                  key={rule.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getMetricIcon(rule.condition.metric)}
                      <h3 className="text-white font-semibold">{rule.name}</h3>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule.id)} />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRule(rule.id)}
                        className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-3">{rule.description}</p>

                  <div className="bg-slate-800/50 rounded p-3 mb-3">
                    <div className="text-sm">
                      <span className="text-slate-400">Condition: </span>
                      <span className="text-white">
                        {rule.condition.metric} {rule.condition.operator} {rule.condition.threshold}{" "}
                        {getMetricUnit(rule.condition.metric)}
                        {rule.condition.duration && ` for ${rule.condition.duration} minutes`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex space-x-4">
                      {rule.actions.notify && <span>✓ Notify</span>}
                      {rule.actions.escalate && <span>✓ Escalate</span>}
                      {rule.actions.autoResolve && <span>✓ Auto-resolve</span>}
                    </div>
                    <span>Created: {rule.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-3">
            {alertRules.map((rule) => (
              <div
                key={rule.id}
                className={`bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors ${
                  !rule.isActive ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getMetricIcon(rule.condition.metric)}
                    <h3 className="text-white font-semibold">{rule.name}</h3>
                    <Badge className={rule.isActive ? "bg-green-600" : "bg-gray-600"}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule.id)} />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteRule(rule.id)}
                      className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-3">{rule.description}</p>

                <div className="bg-slate-800/50 rounded p-3 mb-3">
                  <div className="text-sm">
                    <span className="text-slate-400">Condition: </span>
                    <span className="text-white">
                      {rule.condition.metric} {rule.condition.operator} {rule.condition.threshold}{" "}
                      {getMetricUnit(rule.condition.metric)}
                      {rule.condition.duration && ` for ${rule.condition.duration} minutes`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex space-x-4">
                    {rule.actions.notify && <span>✓ Notify</span>}
                    {rule.actions.escalate && <span>✓ Escalate</span>}
                    {rule.actions.autoResolve && <span>✓ Auto-resolve</span>}
                  </div>
                  <span>Created: {rule.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
