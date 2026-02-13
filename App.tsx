import React, { useEffect, useMemo, useState } from "react";
import { customerDashboardData as initialData } from "./mocks/customerData";
import JourneysSnapshot from "./components/dashboard/JourneysSnapshot";
import RecommendationCard from "./components/dashboard/RecommendationCard";
import ChurnProbabilityChart from "./components/dashboard/ChurnProbabilityChart";
import LTVTrendChart from "./components/dashboard/LTVTrendChart";
import JourneysSankey from "./components/dashboard/JourneysSankey";
import SegmentList from "./components/dashboard/SegmentList";
import UnitEconomicsGrid from "./components/dashboard/UnitEconomicsGrid";
import ChurnMetricsCalculator from "./components/dashboard/ChurnMetricsCalculator";
import { CustomerSegment } from "./types";
import { Sparkles, TrendingUp, RefreshCw } from "lucide-react";
import { simulateNewData } from "./utils/simulationEngine";

const SEGMENT_STORAGE_KEY = "customer-dashboard:selected-segment";

function App() {
  const [data, setData] = useState(initialData);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { segments, journeys, churnSeries, ltvSeries, recommendations, snapshots } = data;

  const defaultSegmentId = segments[0]?.id ?? "";
  const [selectedSegmentId, setSelectedSegmentId] = useState(defaultSegmentId);

  // Persist selection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedSegmentId = window.localStorage.getItem(SEGMENT_STORAGE_KEY);
    if (storedSegmentId && segments.some((s) => s.id === storedSegmentId)) {
      setSelectedSegmentId(storedSegmentId);
    }
  }, [segments]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedSegmentId) {
      window.localStorage.setItem(SEGMENT_STORAGE_KEY, selectedSegmentId);
    }
  }, [selectedSegmentId]);

  const handleSimulateData = () => {
    setIsSimulating(true);
    // Add a small delay to make the "loading" feel real
    setTimeout(() => {
        const newData = simulateNewData();
        setData(newData);
        setLastUpdated(new Date());
        setIsSimulating(false);
    }, 800);
  };

  const selectedSegment: CustomerSegment | undefined = useMemo(
    () => segments.find((s) => s.id === selectedSegmentId),
    [segments, selectedSegmentId]
  );

  const derived = useMemo(() => {
    const journey = journeys.find((item) => item.segmentId === selectedSegmentId);
    const churn = churnSeries.find((item) => item.segmentId === selectedSegmentId);
    const ltv = ltvSeries.find((item) => item.segmentId === selectedSegmentId);
    const recommendation = recommendations.find(
      (item) => item.segmentId === selectedSegmentId
    );
    const snapshot = snapshots.find((item) => item.segmentId === selectedSegmentId);

    const retentionConfidence = churn
      ? 1 - churn.points[churn.points.length - 1]?.probability
      : 0;

    return {
      journey,
      churn,
      ltv,
      recommendation,
      snapshot,
      retentionConfidence,
    };
  }, [selectedSegmentId, journeys, churnSeries, ltvSeries, recommendations, snapshots]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
      <main className="w-full h-full relative max-w-7xl mx-auto">
        
        {/* Decorative Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-4 md:p-8">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/5 pb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-indigo-400 font-semibold mb-2">
                <Sparkles className="size-4" />
                <span>SaaS Metrics & Journey</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-white tracking-tight">
                Customer Lifetime Navigator
              </h1>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mt-2 max-w-2xl">
                Track Unit Economics (LTV:CAC, ARPU) and visualize the customer journey to optimize for profitability.
              </p>
            </div>

            {/* Simulation Button */}
            <div className="flex flex-col items-end gap-2">
                <button 
                    onClick={handleSimulateData}
                    disabled={isSimulating}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 border border-indigo-400/20"
                >
                    <RefreshCw size={16} className={isSimulating ? "animate-spin" : ""} />
                    {isSimulating ? "Crunching Data..." : "Simulate Live Data"}
                </button>
                {lastUpdated && (
                    <span className="text-[10px] text-slate-500">
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                )}
            </div>
          </header>

          {/* New SaaS Unit Economics Section */}
          {selectedSegment && (
             <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <TrendingUp size={16} className="text-emerald-400" />
                    <h2 className="text-lg font-semibold">Unit Economics</h2>
                </div>
                <UnitEconomicsGrid segment={selectedSegment} />
             </section>
          )}

          {/* Segment Selector */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-semibold">Segment Analysis</h2>
                <button className="text-xs text-indigo-400 font-medium hover:text-indigo-300">View All Cohorts</button>
            </div>
            <SegmentList
              segments={segments}
              selectedSegmentId={selectedSegmentId}
              onSelect={setSelectedSegmentId}
            />
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
            
            {/* Top Row: Journey Flow (Spans full width on LG) */}
            <div className="lg:col-span-12">
              <JourneysSankey journey={derived.journey} />
            </div>

            {/* Row 2: Churn Chart + Recommendation */}
            <div className="lg:col-span-8">
              <ChurnProbabilityChart series={derived.churn} />
            </div>
            <div className="lg:col-span-4">
              <RecommendationCard recommendation={derived.recommendation} />
            </div>

            {/* Row 3: Metrics Calculator + Snapshot + LTV */}
            <div className="lg:col-span-4">
                {selectedSegment && derived.churn && (
                    <ChurnMetricsCalculator segment={selectedSegment} churnSeries={derived.churn} />
                )}
            </div>
            <div className="lg:col-span-4">
                <JourneysSnapshot snapshot={derived.snapshot} />
            </div>
            <div className="lg:col-span-4">
                <LTVTrendChart series={derived.ltv} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;