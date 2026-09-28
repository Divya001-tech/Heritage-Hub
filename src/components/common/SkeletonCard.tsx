import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1A1612] rounded-2xl border border-stone-200 dark:border-[#332C24] p-4 shadow-sm animate-pulse space-y-4">
      <div className="w-full h-48 bg-stone-200 dark:bg-stone-800 rounded-xl" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="w-20 h-4 bg-stone-200 dark:bg-stone-800 rounded-full" />
          <div className="w-24 h-4 bg-stone-200 dark:bg-stone-800 rounded-full" />
        </div>
        <div className="w-3/4 h-6 bg-stone-200 dark:bg-stone-800 rounded-md" />
        <div className="w-full h-4 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="w-5/6 h-4 bg-stone-200 dark:bg-stone-800 rounded" />
      </div>
      <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
        <div className="w-28 h-4 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="w-8 h-8 bg-stone-200 dark:bg-stone-800 rounded-full" />
      </div>
    </div>
  );
};

export const SkeletonMap: React.FC = () => {
  return (
    <div className="w-full h-[640px] bg-stone-100 dark:bg-[#15120F] rounded-2xl border border-stone-200 dark:border-[#28231D] p-8 flex flex-col items-center justify-center animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-200/40 dark:via-stone-800/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      <div className="w-20 h-20 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-4">
        <div className="w-8 h-8 rounded-full border-2 border-stone-400 border-t-transparent animate-spin" />
      </div>
      <p className="font-serif-display text-lg font-semibold text-stone-700 dark:text-stone-300">
        Calibrating National Cartographic Commons...
      </p>
      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
        Streaming territorial boundaries, oral dialect coordinates &amp; cultural hotspots
      </p>
    </div>
  );
};
