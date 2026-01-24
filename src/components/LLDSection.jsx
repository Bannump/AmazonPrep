import React, { useState, useEffect } from 'react';
import { ExternalLink, Link as LinkIcon, Github, FileText, Save } from 'lucide-react';
import { lldProblems } from '../data/lldProblems';
import { getLLDProblems, saveLLDProblem } from '../utils/storage';

const LLDSection = () => {
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
  }, []);

  const loadData = () => {
    setLldData(getLLDProblems());
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

  const handleSave = (problemId) => {
    saveLLDProblem(problemId, editForm);
    loadData();
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
    <div className="space-y-4">
      <div className="bg-zinc-800 rounded-lg p-4 mb-6">
        <p className="text-zinc-300 text-sm">
          Track your Low-Level Design (LLD) practice. Document key classes, design patterns, and link to your diagrams or code.
        </p>
      </div>

      <div className="grid gap-4">
        {lldProblems.map((problem) => {
          const isExpanded = expandedCards[problem.id];
          const isEditing = editingProblem === problem.id;
          const data = lldData[problem.id] || {};

          return (
            <div
              key={problem.id}
              className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                onClick={() => !isEditing && toggleCard(problem.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {problem.id}. {problem.title}
                    </h3>
                    <p className="text-sm text-zinc-400">{problem.description}</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(problem);
                      }}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-sm transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      {data.keyClasses || data.resourceLink ? 'Edit' : 'Add Details'}
                    </button>
                  )}
                </div>
              </div>

              {(isExpanded || isEditing) && (
                <div className="border-t border-zinc-800 p-4 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Resource/Diagram Link
                        </label>
                        <input
                          type="text"
                          value={editForm.resourceLink}
                          onChange={(e) => setEditForm({ ...editForm, resourceLink: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                          Key Classes & Patterns
                        </label>
                        <textarea
                          value={editForm.keyClasses}
                          onChange={(e) => setEditForm({ ...editForm, keyClasses: e.target.value })}
                          placeholder="e.g., Strategy Pattern for Pricing, Factory Pattern for Vehicle Creation..."
                          className="w-full h-32 p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                          <Github className="w-4 h-4" />
                          GitHub Link
                        </label>
                        <input
                          type="text"
                          value={editForm.githubLink}
                          onChange={(e) => setEditForm({ ...editForm, githubLink: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Excalidraw Link
                        </label>
                        <input
                          type="text"
                          value={editForm.excalidrawLink}
                          onChange={(e) => setEditForm({ ...editForm, excalidrawLink: e.target.value })}
                          placeholder="https://excalidraw.com/..."
                          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(problem.id)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors flex items-center gap-2"
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
                          <span className="text-sm font-semibold text-zinc-300">Resource Link:</span>
                          <a
                            href={data.resourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-amber-400 hover:text-amber-300 flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open Link
                          </a>
                        </div>
                      )}

                      {data.keyClasses && (
                        <div>
                          <span className="text-sm font-semibold text-zinc-300 block mb-1">Key Classes & Patterns:</span>
                          <p className="text-zinc-300 whitespace-pre-wrap">{data.keyClasses}</p>
                        </div>
                      )}

                      {data.githubLink && (
                        <div>
                          <span className="text-sm font-semibold text-zinc-300">GitHub:</span>
                          <a
                            href={data.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-amber-400 hover:text-amber-300 flex items-center gap-1"
                          >
                            <Github className="w-4 h-4" />
                            View on GitHub
                          </a>
                        </div>
                      )}

                      {data.excalidrawLink && (
                        <div>
                          <span className="text-sm font-semibold text-zinc-300">Excalidraw:</span>
                          <a
                            href={data.excalidrawLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-amber-400 hover:text-amber-300 flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Diagram
                          </a>
                        </div>
                      )}

                      {!data.resourceLink && !data.keyClasses && !data.githubLink && !data.excalidrawLink && (
                        <p className="text-zinc-500 text-sm italic">No details added yet. Click "Add Details" to get started.</p>
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
