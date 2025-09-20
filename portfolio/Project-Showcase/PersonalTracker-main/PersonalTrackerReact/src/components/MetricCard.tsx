import type { FC } from 'react';
import { motion } from 'framer-motion';

type Metric = {
  key: string;
  label: string;
  value: number | string;
  data: { date: string; value: number }[];
};

type MetricCardProps = {
  metric: Metric;
  onClick: () => void;
};

export const MetricCard: FC<MetricCardProps> = ({ metric, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}
    whileTap={{ scale: 0.98 }}
    className={
      'relative rounded-2xl shadow-lg p-6 cursor-pointer bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50 flex flex-row items-center w-full transition-transform duration-200 border border-stone-200 dark:border-stone-700 group'
    }
    onClick={onClick}
    style={{ minHeight: '120px' }}
  >
    {/* Icon Placeholder */}
    <div className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 text-2xl mr-6 group-hover:bg-stone-300 dark:group-hover:bg-stone-600 transition-colors duration-200">
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-lg font-semibold mb-1 drop-shadow-sm">{metric.label}</div>
      <div className="text-4xl font-extrabold mb-1 drop-shadow-lg tracking-tight">{metric.value}</div>
      <div className="text-xs opacity-70">Last 7 days</div>
    </div>
  </motion.div>
); 