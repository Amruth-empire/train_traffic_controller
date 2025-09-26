import type { Train, Station, Alert, KPI, User, OptimizationSuggestion, TrackSection } from "./types"

// Mock users for different roles
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@railway.com",
    name: "System Administrator",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "controller@railway.com",
    name: "Section Controller",
    role: "controller",
    section: "North",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    email: "viewer@railway.com",
    name: "Operations Viewer",
    role: "viewer",
    createdAt: new Date("2024-02-01"),
  },
]

// Mock stations
export const mockStations: Station[] = [
  {
    id: "st1",
    name: "Central Station",
    code: "CS",
    coordinates: { lat: 40.7128, lng: -74.006 },
    platforms: 12,
    capacity: 500,
    currentOccupancy: 320,
    section: "Central",
  },
  {
    id: "st2",
    name: "North Terminal",
    code: "NT",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    platforms: 8,
    capacity: 300,
    currentOccupancy: 180,
    section: "North",
  },
  {
    id: "st3",
    name: "South Junction",
    code: "SJ",
    coordinates: { lat: 40.6892, lng: -74.0445 },
    platforms: 6,
    capacity: 200,
    currentOccupancy: 95,
    section: "South",
  },
  {
    id: "st4",
    name: "East Hub",
    code: "EH",
    coordinates: { lat: 40.7282, lng: -73.7949 },
    platforms: 10,
    capacity: 400,
    currentOccupancy: 250,
    section: "East",
  },
]

// Mock trains with realistic data
export const mockTrains: Train[] = [
  {
    id: "tr1",
    number: "EX101",
    name: "Rajdhani Express",
    type: "express",
    status: "running",
    currentLocation: "Central Station",
    destination: "North Terminal",
    origin: "South Junction",
    scheduledDeparture: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    actualDeparture: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
    scheduledArrival: new Date(Date.now() + 15 * 60 * 1000), // 15 min from now
    estimatedArrival: new Date(Date.now() + 20 * 60 * 1000), // 20 min from now
    delay: 5,
    priority: 8,
    capacity: 400,
    occupancy: 320,
    speed: 85,
    maxSpeed: 120,
    coordinates: { lat: 40.735, lng: -73.99 },
    occupiedTrack: "main-up",
  },
  {
    id: "tr2",
    number: "FR205",
    name: "Freight Express",
    type: "freight",
    status: "delayed",
    currentLocation: "East Hub",
    destination: "South Junction",
    origin: "North Terminal",
    scheduledDeparture: new Date(Date.now() - 45 * 60 * 1000),
    actualDeparture: new Date(Date.now() - 30 * 60 * 1000),
    scheduledArrival: new Date(Date.now() + 30 * 60 * 1000),
    estimatedArrival: new Date(Date.now() + 45 * 60 * 1000),
    delay: 15,
    priority: 3,
    capacity: 0, // freight
    occupancy: 0,
    speed: 45,
    maxSpeed: 80,
    coordinates: { lat: 40.72, lng: -73.8 },
    occupiedTrack: "loop-2",
  },
  {
    id: "tr3",
    number: "PS303",
    name: "Shatabdi Express",
    type: "passenger",
    status: "scheduled",
    currentLocation: "North Terminal",
    destination: "Central Station",
    origin: "North Terminal",
    scheduledDeparture: new Date(Date.now() + 10 * 60 * 1000),
    scheduledArrival: new Date(Date.now() + 40 * 60 * 1000),
    delay: 0,
    priority: 6,
    capacity: 250,
    occupancy: 180,
    speed: 0,
    maxSpeed: 100,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    occupiedTrack: "platform-1",
  },
  {
    id: "tr4",
    number: "FR410",
    name: "Goods Train",
    type: "freight",
    status: "running",
    currentLocation: "East Hub",
    destination: "Central Station",
    origin: "South Junction",
    scheduledDeparture: new Date(Date.now() - 20 * 60 * 1000),
    actualDeparture: new Date(Date.now() - 20 * 60 * 1000),
    scheduledArrival: new Date(Date.now() + 25 * 60 * 1000),
    estimatedArrival: new Date(Date.now() + 25 * 60 * 1000),
    delay: 0,
    priority: 2,
    capacity: 0,
    occupancy: 0,
    speed: 35,
    maxSpeed: 60,
    coordinates: { lat: 40.7100, lng: -73.8200 },
    occupiedTrack: "freight-siding",
  },
]

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: "al1",
    type: "delay",
    severity: "medium",
    title: "Train FR205 Delayed",
    description: "Freight train FR205 is experiencing a 15-minute delay due to signal issues.",
    affectedTrains: ["tr2"],
    affectedStations: ["st3", "st4"],
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
    createdBy: "2",
  },
  {
    id: "al2",
    type: "maintenance",
    severity: "low",
    title: "Platform 3 Maintenance",
    description: "Scheduled maintenance on Platform 3 at Central Station from 2:00 AM to 4:00 AM.",
    affectedTrains: [],
    affectedStations: ["st1"],
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    createdBy: "1",
  },
]

// Mock KPIs
export const mockKPIs: KPI = {
  onTimePerformance: 87.5,
  averageDelay: 8.2,
  totalTrainsToday: 156,
  activeTrains: 23,
  delayedTrains: 5,
  cancelledTrains: 2,
  stationCapacityUtilization: 68.3,
  systemEfficiency: 91.2,
}

// Mock optimization suggestions
export const mockOptimizationSuggestions: OptimizationSuggestion[] = [
  {
    id: "opt1",
    type: "reroute",
    trainId: "tr2",
    description: "Reroute FR205 via alternate track to reduce delay by 8 minutes",
    estimatedImprovement: "Reduce delay from 15min to 7min",
    confidence: 0.85,
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    status: "pending",
  },
  {
    id: "opt2",
    type: "priority_change",
    trainId: "tr1",
    description: "Increase priority of EX101 to minimize passenger impact",
    estimatedImprovement: "Reduce passenger delay by 3 minutes",
    confidence: 0.72,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    status: "pending",
  },
]

// Mock track sections
export const mockTrackSections: TrackSection[] = [
  // Main Lines
  {
    id: "main-up",
    name: "Main Line UP",
    status: "OCCUPIED",
    length: 1200,
    maxSpeed: 100,
    type: "main",
  },
  {
    id: "main-dn",
    name: "Main Line DN",
    status: "CLEAR",
    length: 1200,
    maxSpeed: 100,
    type: "main",
  },
  {
    id: "main-track",
    name: "Maintenance Track",
    status: "MAINTENANCE",
    length: 600,
    maxSpeed: 20,
    type: "main",
  },
  // Loop Lines
  {
    id: "loop-1",
    name: "Loop Line 1",
    status: "CLEAR",
    length: 800,
    maxSpeed: 60,
    type: "loop",
  },
  {
    id: "loop-2",
    name: "Loop Line 2",
    status: "OCCUPIED",
    length: 800,
    maxSpeed: 60,
    type: "loop",
  },
  // Platform Roads
  {
    id: "platform-1",
    name: "Platform Road 1",
    status: "OCCUPIED",
    length: 400,
    maxSpeed: 30,
    type: "platform",
  },
  {
    id: "platform-2",
    name: "Platform Road 2",
    status: "CLEAR",
    length: 400,
    maxSpeed: 30,
    type: "platform",
  },
  // Special Tracks
  {
    id: "freight-siding",
    name: "Freight Siding",
    status: "OCCUPIED",
    length: 600,
    maxSpeed: 25,
    type: "special",
  },
]

// Helper functions for data manipulation
export const getTrainsByStatus = (status: Train["status"]) => mockTrains.filter((train) => train.status === status)

export const getDelayedTrains = () => mockTrains.filter((train) => train.delay > 0)

export const getTrainsBySection = (section: string) =>
  mockTrains.filter((train) => {
    const station = mockStations.find((s) => s.name === train.currentLocation)
    return station?.section === section
  })

export const getActiveAlerts = () => mockAlerts.filter((alert) => !alert.resolvedAt)

export const calculateAverageDelay = () => {
  const delayedTrains = getDelayedTrains()
  if (delayedTrains.length === 0) return 0
  return delayedTrains.reduce((sum, train) => sum + train.delay, 0) / delayedTrains.length
}
