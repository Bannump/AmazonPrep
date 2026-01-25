import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { leadershipPrinciples } from '../data/leadershipPrinciples';
import * as userStorage from '../utils/userStorage';

const LeadershipPrinciplesSection = ({ userId = null, onDataUpdate }) => {
  const [expandedCards, setExpandedCards] = useState({});
  const [principlesData, setPrinciplesData] = useState({});

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    const data = await userStorage.getLeadershipPrinciples(userId);
    setPrinciplesData(data);
  };

  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleStoryChange = async (id, value) => {
    await userStorage.saveLeadershipPrinciple(id, { starStory: value }, userId);
    await loadData();
    onDataUpdate?.();
  };

  const getStatus = (id) => {
    const data = principlesData[id];
    if (!data || !data.starStory || data.starStory.trim() === '') {
      return { text: 'No Story', color: 'bg-zinc-900 text-zinc-500' };
    }
    if (data.status === 'Finalized') {
      return { text: 'Finalized', color: 'bg-green-500/20 text-green-400' };
    }
    return { text: 'Draft', color: 'bg-yellow-500/20 text-yellow-400' };
  };

  const handleStatusChange = async (id, status) => {
    await userStorage.saveLeadershipPrinciple(id, { status }, userId);
    await loadData();
    onDataUpdate?.();
  };

  return (
    <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
      <div className="bg-zinc-900/50 rounded-lg p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6 border border-zinc-800/50">
        <p className="text-zinc-300 text-[11px] sm:text-xs md:text-sm">
          Use the STAR method (Situation, Task, Action, Result) to prepare your behavioral stories for each Leadership Principle.
        </p>
      </div>

      <div className="grid gap-2.5 sm:gap-3 md:gap-4">
        {leadershipPrinciples.map((principle) => {
          const isExpanded = expandedCards[principle.id];
          const status = getStatus(principle.id);
          const data = principlesData[principle.id] || {};
          const starStory = data.starStory || '';

          return (
            <div
              key={principle.id}
              className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 overflow-hidden"
            >
              <div
                className="p-2.5 sm:p-3 md:p-4 cursor-pointer hover:bg-zinc-900/30 active:bg-zinc-900/40 transition-colors flex items-center justify-between min-h-[50px] sm:min-h-[60px] touch-manipulation"
                onClick={() => toggleCard(principle.id)}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-zinc-100 mb-0.5 break-words leading-tight">
                      {principle.id}. {principle.name}
                    </h3>
                    {!isExpanded && (
                      <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 line-clamp-1 mt-0.5">
                        {principle.description}
                      </p>
                    )}
                  </div>
                  <span className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold flex-shrink-0 ${status.color}`}>
                    {status.text}
                  </span>
                </div>
                <div className="ml-1.5 sm:ml-2 md:ml-4 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-zinc-800/50 p-2.5 sm:p-3 md:p-4 space-y-2.5 sm:space-y-3 md:space-y-4">
                  <div>
                    <p className="text-zinc-300 text-xs sm:text-sm mb-3 sm:mb-4">{principle.description}</p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      STAR Method Story
                    </label>
                    <div className="mb-2 text-xs text-zinc-400 space-y-1">
                      <p><strong>Situation:</strong> Set the context and background</p>
                      <p><strong>Task:</strong> Describe your responsibility</p>
                      <p><strong>Action:</strong> Explain what you did</p>
                      <p><strong>Result:</strong> Share the outcome and impact</p>
                    </div>
                    <textarea
                      value={starStory}
                      onChange={(e) => handleStoryChange(principle.id, e.target.value)}
                      placeholder="Write your STAR method story here..."
                      className="w-full min-h-[180px] sm:min-h-[192px] p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 resize-y text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm text-zinc-400">Status:</span>
                    <select
                      value={data.status || 'Draft'}
                      onChange={(e) => handleStatusChange(principle.id, e.target.value)}
                      className="px-3 py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 min-h-[44px] touch-manipulation"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Finalized">Finalized</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadershipPrinciplesSection;
