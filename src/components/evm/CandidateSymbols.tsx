import React from 'react';
import { Flame, Scale, TreePine, BookOpen, Bike, XCircle } from 'lucide-react';

interface CandidateSymbolProps {
  symbolKey: string;
  className?: string;
}

export const CandidateSymbol: React.FC<CandidateSymbolProps> = ({ symbolKey, className = 'w-7 h-7' }) => {
  switch (symbolKey) {
    case 'torch':
      return (
        <div className={`p-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center ${className}`}>
          <Flame className="w-full h-full" />
        </div>
      );
    case 'scales':
      return (
        <div className={`p-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center ${className}`}>
          <Scale className="w-full h-full" />
        </div>
      );
    case 'tree':
      return (
        <div className={`p-1.5 rounded-md bg-green-50 border border-green-200 text-green-700 flex items-center justify-center ${className}`}>
          <TreePine className="w-full h-full" />
        </div>
      );
    case 'book':
      return (
        <div className={`p-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center ${className}`}>
          <BookOpen className="w-full h-full" />
        </div>
      );
    case 'bicycle':
      return (
        <div className={`p-1.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center ${className}`}>
          <Bike className="w-full h-full" />
        </div>
      );
    case 'nota':
      return (
        <div className={`p-1.5 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-center justify-center ${className}`}>
          <XCircle className="w-full h-full" />
        </div>
      );
    default:
      return (
        <div className={`p-1.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center ${className}`}>
          <XCircle className="w-full h-full" />
        </div>
      );
  }
};
