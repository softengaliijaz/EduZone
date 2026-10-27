import React, { lazy, Suspense, useEffect, useRef, useState } from "react";

const DashboardCharts = lazy(() =>
  import("./DashboardCharts").then(({ DashboardCharts: Component }) => ({
    default: Component,
  })),
);

const ChartPlaceholder = () => (
  <div className="admin-charts" aria-hidden="true">
    <div className="admin-chart-panel admin-chart-placeholder" />
    <div className="admin-chart-panel admin-chart-placeholder" />
  </div>
);

const DeferredDashboardCharts = ({ userTrend, enrollmentTrend }) => {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {shouldLoad ? (
        <Suspense fallback={<ChartPlaceholder />}>
          <DashboardCharts
            userTrend={userTrend}
            enrollmentTrend={enrollmentTrend}
          />
        </Suspense>
      ) : (
        <ChartPlaceholder />
      )}
    </div>
  );
};

export default DeferredDashboardCharts;
