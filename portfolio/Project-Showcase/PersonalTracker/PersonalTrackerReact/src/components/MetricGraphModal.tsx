import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

type Metric = {
  key: string;
  label: string;
  value: number | string;
  color: string;
  data: { date: string; value: number }[];
};

type MetricGraphModalProps = {
  metric: Metric | null;
  onClose: () => void;
};

export const MetricGraphModal: FC<MetricGraphModalProps> = ({ metric, onClose }) => (
  <AnimatePresence>
    {metric && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-10 shadow-2xl w-full max-w-lg relative border border-stone-200 dark:border-stone-700"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-50 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <div className="text-xl font-bold mb-4 text-stone-900 dark:text-stone-50">{metric.label} - Last 7 Days</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metric.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="date" stroke="#78716c" />
              <YAxis stroke="#78716c" />
              <Tooltip contentStyle={{ background: '#fafaf9', color: '#292524', borderColor: '#a8a29e' }} wrapperStyle={{ borderRadius: '0.75rem' }} />
              <Line type="monotone" dataKey="value" stroke="#57534e" strokeWidth={3} dot={{ r: 5, fill: '#57534e' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
); 