import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetricCard } from './MetricCard';

type Metric = {
  key: string;
  label: string;
  value: number | string;
  color: string;
  data: { date: string; value: number }[];
};

type DashboardGridProps = {
  metrics: Metric[];
  onMetricClick: (metric: Metric) => void;
};

export const DashboardGrid: FC<DashboardGridProps> = ({ metrics, onMetricClick }) => (
  <AnimatePresence>
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap gap-8 w-full max-w-screen-lg justify-center items-stretch">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.4, delay: idx * 0.08, type: 'spring', stiffness: 80 }}
            className="flex-1 min-w-[260px] max-w-[350px] flex"
          >
            <MetricCard metric={metric} onClick={() => onMetricClick(metric)} />
          </motion.div>
        ))}
      </div>
    </div>
  </AnimatePresence>
); 