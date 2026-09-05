import React from "react";

export function RoomCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-64 bg-slate-300 dark:bg-slate-800 w-full"></div>
      
      <div className="p-6 space-y-4">
        {/* Title & Price */}
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-300 dark:bg-slate-800 rounded-md w-1/2"></div>
          <div className="h-5 bg-slate-300 dark:bg-slate-800 rounded-md w-1/4"></div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-slate-300 dark:bg-slate-800 rounded-md w-full"></div>
          <div className="h-3 bg-slate-300 dark:bg-slate-800 rounded-md w-5/6"></div>
        </div>

        {/* Specs */}
        <div className="flex space-x-4 pt-2">
          <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-md w-12"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-md w-12"></div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Button */}
        <div className="h-10 bg-slate-300 dark:bg-slate-800 rounded-xl w-full"></div>
      </div>
    </div>
  );
}

export function RoomDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      {/* Breadcrumb / Title */}
      <div className="h-8 bg-slate-300 dark:bg-slate-800 rounded-md w-1/3"></div>

      {/* Image gallery skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-96 bg-slate-300 dark:bg-slate-800 rounded-3xl"></div>
        <div className="grid grid-rows-2 gap-4 h-96">
          <div className="bg-slate-300 dark:bg-slate-800 rounded-3xl"></div>
          <div className="bg-slate-300 dark:bg-slate-800 rounded-3xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 bg-slate-300 dark:bg-slate-800 rounded-md w-1/4"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-md w-full"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-md w-5/6"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-md w-4/5"></div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl h-80"></div>
      </div>
    </div>
  );
}
