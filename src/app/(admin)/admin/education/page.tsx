'use client';

import { BookOpen, Edit, HelpCircle, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  pointsReward: number;
}

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState<'articles' | 'quizzes'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [articleForm, setArticleForm] = useState({ title: '', content: '', category: '' });
  const [quizForm, setQuizForm] = useState({ 
    question: '', 
    options: ['', '', '', ''], 
    correctAnswer: 0, 
    category: '', 
    pointsReward: 10 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'articles') {
        const res = await fetch('/api/admin/articles');
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
        }
      } else {
        const res = await fetch('/api/admin/quizzes');
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data.quizzes || []);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAdd = () => {
    setEditItem(null);
    if (activeTab === 'articles') {
      setArticleForm({ title: '', content: '', category: '' });
    } else {
      setQuizForm({ question: '', options: ['', '', '', ''], correctAnswer: 0, category: '', pointsReward: 10 });
    }
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    if (activeTab === 'articles') {
      setArticleForm({ title: item.title, content: item.content, category: item.category });
    } else {
      setQuizForm({ 
        question: item.question, 
        options: item.options || ['', '', '', ''], 
        correctAnswer: item.correctAnswer, 
        category: item.category, 
        pointsReward: item.pointsReward 
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const endpoint = activeTab === 'articles' ? '/api/admin/articles' : '/api/admin/quizzes';
      const body = activeTab === 'articles' ? articleForm : quizForm;
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `${endpoint}/${editItem.id}` : endpoint;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchData();
        setShowModal(false);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    
    try {
      const endpoint = activeTab === 'articles' ? '/api/admin/articles' : '/api/admin/quizzes';
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Education Content</h1>
          <p className="text-foreground/60 mt-1">Kelola artikel dan kuis edukasi</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
        >
          <Plus size={18} />
          Add {activeTab === 'articles' ? 'Article' : 'Quiz'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'articles'
              ? 'bg-emerald-500 text-foreground'
              : 'bg-white/60 text-foreground/60 hover:bg-white/50'
          }`}
        >
          <BookOpen size={18} />
          Articles ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'quizzes'
              ? 'bg-emerald-500 text-foreground'
              : 'bg-white/60 text-foreground/60 hover:bg-white/50'
          }`}
        >
          <HelpCircle size={18} />
          Quizzes ({quizzes.length})
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {/* Articles Tab */}
          {activeTab === 'articles' && (
            <div className="bg-white/60 border border-black/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-foreground/60">
                        No articles. Database may not be configured.
                      </td>
                    </tr>
                  ) : (
                    articles.map((article) => (
                      <tr key={article.id} className="hover:bg-white/60 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-foreground">{article.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground/60">
                          {new Date(article.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(article)}
                              className="p-2 text-foreground/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(article.id)}
                              className="p-2 text-foreground/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div className="bg-white/60 border border-black/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Question</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {quizzes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-foreground/60">
                        No quizzes. Database may not be configured.
                      </td>
                    </tr>
                  ) : (
                    quizzes.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-white/60 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-foreground">{quiz.question}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs">
                            {quiz.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-400 font-semibold">+{quiz.pointsReward}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(quiz)}
                              className="p-2 text-foreground/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(quiz.id)}
                              className="p-2 text-foreground/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="glass-card border border-black/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {editItem ? 'Edit' : 'Add'} {activeTab === 'articles' ? 'Article' : 'Quiz'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-foreground/60 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            {activeTab === 'articles' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground/60 mb-1">Title</label>
                  <input
                    type="text"
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm text-foreground/60 mb-1">Category</label>
                  <input
                    type="text"
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm text-foreground/60 mb-1">Content</label>
                  <textarea
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground/60 mb-1">Question</label>
                  <input
                    type="text"
                    value={quizForm.question}
                    onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                    className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm text-foreground/60 mb-1">Options</label>
                  {quizForm.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={quizForm.correctAnswer === i}
                        onChange={() => setQuizForm({ ...quizForm, correctAnswer: i })}
                        className="accent-emerald-500"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...quizForm.options];
                          newOptions[i] = e.target.value;
                          setQuizForm({ ...quizForm, options: newOptions });
                        }}
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-foreground/40">Select radio for correct answer</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground/60 mb-1">Category</label>
                    <input
                      type="text"
                      value={quizForm.category}
                      onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground/60 mb-1">Points Reward</label>
                    <input
                      type="number"
                      value={quizForm.pointsReward}
                      onChange={(e) => setQuizForm({ ...quizForm, pointsReward: parseInt(e.target.value) || 10 })}
                      className="w-full px-4 py-2 bg-white/60 border border-black/10 rounded-lg text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-foreground rounded-lg"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
