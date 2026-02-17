import { useEffect, useMemo, useState } from "react";
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
import { Sparkles, TrendingUp, RefreshCw, BrainCircuit } from "lucide-react";
import { simulateNewData } from "./utils/simulationEngine";
import { generateSegmentInsights, calculateUnitEconomicsHealth } from "./utils/geminiInsights";

const SEGMENT_STORAGE_KEY = "customer-dashboard:selected-segment";

interface AIInsight {
  insight: string;
  recommendation: string;
  confidence: number;
  loading: boolean;
}

function App() {
  const [data, setData] = useState(initialData);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [aiInsight, setAiInsight] = useState<AIInsight>({
    insight: "",
    recommendation: "",
    confidence: 0,
    loading: false,
  });

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

  // AI Insights generation
  useEffect(() => {
    const fetchInsights = async () => {
      if (!selectedSegment) return;
      
      setAiInsight((prev) => ({ ...prev, loading: true }));
      
      try {
        const result = await generateSegmentInsights(selectedSegment);
        setAiInsight({
          insight: result.insight,
          recommendation: result.recommendation,
          confidence: result.confidence,
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch AI insights:", error);
        setAiInsight({
          insight: "Unable to generate insights.",
          recommendation: "Check your Gemini API key configuration.",
          confidence: 0,
          loading: false,
        });
      }
    };

    fetchInsights();
  }, [selectedSegmentId]);

  const handleSimulateData = () => {
    setIsSimulating(true);
    setTimeout(() => {
      try {
        const newData = simulateNewData();
        setData(newData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Simulation failed:", error);
      } finally {
        setIsSimulating(false);
      }
    }, 800);
  };

  const selectedSegment: CustomerSegment | undefined = useMemo(
    () => segments.find((s) => s.id === selectedSegmentId),
    [segments, selectedSegmentId]
  );

  const unitEconomicsHealth = useMemo(() => {
    if (!selectedSegment) return null;
    return calculateUnitEconomicsHealth(selectedSegment);
  }, [selectedSegment]);

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
                Track Unit Economics (LTV:CAC, ARPU) and visualize the customer journey. 
                AI-powered insights for data-driven decisions.
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

          {/* AI Insights Section */}
          {selectedSegment && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
              <div className="flex items-center gap-2 mb-4 px-1">
                <BrainCircuit size={16} className="text-purple-400" />
                <h2 className="text-lg font-semibold">AI Insights</h2>
                {aiInsight.loading && (
                  <span className="text-xs text-slate-500 animate-pulse">Analyzing...</span>
                )}
              </div>
              <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 rounded-2xl p-6">
                {aiInsight.loading ? (
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span>Gemini is analyzing segment data...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        aiInsight.confidence >= 0.8 ? "bg-emerald-400" :
                        aiInsight.confidence >= 0.6 ? "bg-yellow-400" : "bg-red-400"
                      }`} />
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">{aiInsight.insight}</p>
                        <p className="text-slate-400 text-sm">{aiInsight.recommendation}</p>
                      </div>
                    </div>
                    {unitEconomicsHealth && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Unit Economics Health Score</span>
                          <span className={`text-lg font-bold ${
                            unitEconomicsHealth.status === "healthy" ? "text-emerald-400" :
                            unitEconomicsHealth.status === "at-risk" ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {unitEconomicsHealth.score}/100
                          </span>
                        </div>
                        <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              unitEconomicsHealth.status === "healthy" ? "bg-emerald-400" :
                              unitEconomicsHealth.status === "at-risk" ? "bg-yellow-400" : "bg-red-400"
                            }`}
                            style={{ width: `${unitEconomicsHealth.score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

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

            {/* Row 3: LTV Chart + Journey Snapshot */}
            <div className="lg:col-span-8">
              <LTVTrendChart series={derived.ltv} />
            </div>
            <div className="lg:col-span-4">
              <JourneysSnapshot snapshot={derived.snapshot} />
            </div>

            {/* Row 4: Churn Metrics Calculator */}
            <div className="lg:col-span-12">
              {selectedSegment && derived.churn && (
                <ChurnMetricsCalculator segment={selectedSegment} churnSeries={derived.churn} />
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-white/5 pt-8 pb-4 text-center text-slate-500 text-sm">
            <p>Built with React + TypeScript + Gemini AI</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
