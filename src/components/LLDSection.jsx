import React, { useState, useEffect } from 'react';
import { ExternalLink, Link as LinkIcon, Github, FileText, Save } from 'lucide-react';
import { lldProblems } from '../data/lldProblems';
import * as userStorage from '../utils/userStorage';

const LLDSection = ({ userId = null }) => {
  const [lldData, setLldData] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [editingProblem, setEditingProblem] = useState(null);
  const [editForm, setEditForm] = useState({
    resourceLink: '',
    keyClasses: '',
    githubLink: '',
    excalidrawLink: ''
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    const data = await userStorage.getLLDProblems(userId);
    setLldData(data);
  };

  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleEdit = (problem) => {
    const data = lldData[problem.id] || {};
    setEditingProblem(problem.id);
    setEditForm({
      resourceLink: data.resourceLink || '',
      keyClasses: data.keyClasses || '',
      githubLink: data.githubLink || '',
      excalidrawLink: data.excalidrawLink || ''
    });
  };

  const handleSave = async (problemId) => {
    await userStorage.saveLLDProblem(problemId, editForm, userId);
    await loadData();
    setEditingProblem(null);
    setEditForm({
      resourceLink: '',
      keyClasses: '',
      githubLink: '',
      excalidrawLink: ''
    });
  };

  const handleCancel = () => {
    setEditingProblem(null);
    setEditForm({
      resourceLink: '',
      keyClasses: '',
      githubLink: '',
      excalidrawLink: ''
    });
  };

  return (
    <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
      <div className="bg-zinc-900/50 rounded-lg p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6 border border-zinc-800/50">
        <p className="text-zinc-300 text-[11px] sm:text-xs md:text-sm">
          Track your Low-Level Design (LLD) practice. Document key classes, design patterns, and link to your diagrams or code.
        </p>
      </div>

      <div className="grid gap-2.5 sm:gap-3 md:gap-4">
        {lldProblems.map((problem) => {
          const isExpanded = expandedCards[problem.id];
          const isEditing = editingProblem === problem.id;
          const data = lldData[problem.id] || {};

          return (
            <div
              key={problem.id}
              className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 overflow-hidden"
            >
              <div
                className="p-2.5 sm:p-3 md:p-4 cursor-pointer hover:bg-zinc-900/30 active:bg-zinc-900/40 transition-colors"
                onClick={() => !isEditing && toggleCard(problem.id)}
              >
                <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-zinc-100 mb-0.5 break-words leading-tight">
                      {problem.id}. {problem.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 break-words mt-0.5">{problem.description}</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(problem);
                      }}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-zinc-50 rounded-lg text-[11px] sm:text-xs md:text-sm transition-colors flex items-center gap-1 sm:gap-1.5 flex-shrink-0 min-h-[40px] sm:min-h-[44px] touch-manipulation"
                    >
                      <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{data.keyClasses || data.resourceLink ? 'Edit' : 'Add Details'}</span>
                      <span className="sm:hidden">{data.keyClasses || data.resourceLink ? 'Edit' : 'Add'}</span>
                    </button>
                  )}
                </div>
              </div>

              {(isExpanded || isEditing) && (
                <div className="border-t border-zinc-800/50 p-2.5 sm:p-3 md:p-4 space-y-2.5 sm:space-y-3 md:space-y-4">
                  {isEditing ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 flex-shrink-0" />
                          Resource/Diagram Link
                        </label>
                        <input
                          type="text"
                          value={editForm.resourceLink}
                          onChange={(e) => setEditForm({ ...editForm, resourceLink: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-2.5 sm:p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 text-sm min-h-[44px] touch-manipulation"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2">
                          Key Classes & Patterns
                        </label>
                        <textarea
                          value={editForm.keyClasses}
                          onChange={(e) => setEditForm({ ...editForm, keyClasses: e.target.value })}
                          placeholder="e.g., Strategy Pattern for Pricing, Factory Pattern for Vehicle Creation..."
                          className="w-full min-h-[120px] sm:min-h-[128px] p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 resize-y text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                          <Github className="w-4 h-4 flex-shrink-0" />
                          GitHub Link
                        </label>
                        <input
                          type="text"
                          value={editForm.githubLink}
                          onChange={(e) => setEditForm({ ...editForm, githubLink: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full p-2.5 sm:p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 text-sm min-h-[44px] touch-manipulation"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 flex-shrink-0" />
                          Excalidraw Link
                        </label>
                        <input
                          type="text"
                          value={editForm.excalidrawLink}
                          onChange={(e) => setEditForm({ ...editForm, excalidrawLink: e.target.value })}
                          placeholder="https://excalidraw.com/..."
                          className="w-full p-2.5 sm:p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 text-sm min-h-[44px] touch-manipulation"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                        <button
                          onClick={handleCancel}
                          className="w-full sm:w-auto px-4 py-3 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-100 rounded-lg transition-colors font-medium min-h-[44px] touch-manipulation"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(problem.id)}
                          className="w-full sm:w-auto px-4 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-zinc-50 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium min-h-[44px] touch-manipulation"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.resourceLink && (
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-zinc-300 block mb-1">Resource Link:</span>
                          <a
                            href={data.resourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 active:text-blue-200 flex items-center gap-1.5 text-sm min-h-[44px] touch-manipulation"
                          >
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            <span className="break-all">{data.resourceLink}</span>
                          </a>
                        </div>
                      )}

                      {data.keyClasses && (
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-zinc-300 block mb-1">Key Classes & Patterns:</span>
                          <p className="text-sm sm:text-base text-zinc-300 whitespace-pre-wrap break-words">{data.keyClasses}</p>
                        </div>
                      )}

                      {data.githubLink && (
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-zinc-300 block mb-1">GitHub:</span>
                          <a
                            href={data.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 active:text-blue-200 flex items-center gap-1.5 text-sm min-h-[44px] touch-manipulation"
                          >
                            <Github className="w-4 h-4 flex-shrink-0" />
                            <span className="break-all">View on GitHub</span>
                          </a>
                        </div>
                      )}

                      {data.excalidrawLink && (
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-zinc-300 block mb-1">Excalidraw:</span>
                          <a
                            href={data.excalidrawLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 active:text-blue-200 flex items-center gap-1.5 text-sm min-h-[44px] touch-manipulation"
                          >
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            <span className="break-all">View Diagram</span>
                          </a>
                        </div>
                      )}

                      {!data.resourceLink && !data.keyClasses && !data.githubLink && !data.excalidrawLink && (
                        <p className="text-zinc-500 text-xs sm:text-sm italic">No details added yet. Click "Add Details" to get started.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LLDSection;
