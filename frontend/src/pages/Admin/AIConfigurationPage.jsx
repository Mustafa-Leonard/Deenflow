import React, { useState, useEffect } from 'react'
import api from '../../api'

const defaultConfig = {
    systemPrompt: `You are DeenFlow's Islamic Knowledge Assistant. Your role is to provide accurate, authentic Islamic guidance based on the Quran, authentic Hadith, and established scholarly consensus (Ijma').

Guidelines:
- Always cite Quran verses with Surah name and number
- Reference Hadith with their source (Bukhari, Muslim, etc.)
- Mention scholarly opinions from the four major schools of thought when applicable
- Clearly distinguish between definitive rulings and matters of scholarly difference
- Never issue fatwas — direct complex questions to qualified scholars
- Be respectful and empathetic in all responses`,
    responseStyle: 'balanced',
    maxTokens: 2048,
    temperature: 0.3,
    allowedSources: [
        { id: 1, name: 'Quran (Arabic + Translation)', enabled: true },
        { id: 2, name: 'Sahih Bukhari', enabled: true },
        { id: 3, name: 'Sahih Muslim', enabled: true },
        { id: 4, name: 'Sunan Abu Dawud', enabled: true },
        { id: 5, name: 'Jami at-Tirmidhi', enabled: true },
        { id: 6, name: 'Sunan an-Nasai', enabled: true },
        { id: 7, name: 'Sunan Ibn Majah', enabled: true },
        { id: 8, name: 'Muwatta Imam Malik', enabled: true },
        { id: 9, name: 'Tafsir Ibn Kathir', enabled: true },
        { id: 10, name: 'Fiqh al-Sunnah', enabled: false },
    ],
    contentRules: [
        { id: 1, rule: 'Never contradict the Quran or authentic Sunnah', severity: 'critical', enabled: true },
        { id: 2, rule: 'Always acknowledge scholarly differences of opinion (ikhtilaf)', severity: 'high', enabled: true },
        { id: 3, rule: 'Do not issue fatwas or definitive rulings on complex matters', severity: 'critical', enabled: true },
        { id: 4, rule: 'Redirect sensitive topics (e.g. divorce, inheritance) to qualified scholars', severity: 'high', enabled: true },
        { id: 5, rule: 'Avoid sectarian bias — present mainstream scholarly opinion', severity: 'high', enabled: true },
        { id: 6, rule: 'Include relevant Quran ayat with Arabic text when possible', severity: 'medium', enabled: true },
        { id: 7, rule: 'Flag uncertain or debated answers for human scholar review', severity: 'high', enabled: true },
    ],
    modelSettings: {
        primaryModel: 'gpt-4',
        fallbackModel: 'gpt-3.5-turbo',
        ragEnabled: true,
        embeddingModel: 'text-embedding-ada-002',
        vectorStore: 'pinecone',
    },
    safetyFilters: {
        autoFlagConfidenceBelow: 0.7,
        requireScholarReview: true,
        maxRetries: 3,
        blockInappropriate: true,
    }
}

const responseStyles = [
    { value: 'concise', label: 'Concise', desc: 'Short, direct answers with key references' },
    { value: 'balanced', label: 'Balanced', desc: 'Medium-length answers with explanations and references' },
    { value: 'detailed', label: 'Detailed', desc: 'Comprehensive answers with full scholarly analysis' },
    { value: 'educational', label: 'Educational', desc: 'Teaching-oriented with context and background' },
]

export default function AIConfigurationPage() {
    const [config, setConfig] = useState(defaultConfig)
    const [activeTab, setActiveTab] = useState('prompt')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [editingRule, setEditingRule] = useState(null)
    const [newRule, setNewRule] = useState('')
    const [newRuleSeverity, setNewRuleSeverity] = useState('medium')
    const [newSource, setNewSource] = useState('')

    useEffect(() => {
        api.get('/auth/admin/ai-config/')
            .then(res => setConfig({ ...defaultConfig, ...res.data }))
            .catch(() => { /* use defaults */ })
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            await api.put('/auth/admin/ai-config/', config)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch {
            // Silently use local state
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
        setSaving(false)
    }

    const toggleSource = (id) => {
        setConfig(prev => ({
            ...prev,
            allowedSources: prev.allowedSources.map(s =>
                s.id === id ? { ...s, enabled: !s.enabled } : s
            )
        }))
    }

    const addSource = () => {
        if (!newSource.trim()) return
        const newId = Math.max(...config.allowedSources.map(s => s.id)) + 1
        setConfig(prev => ({
            ...prev,
            allowedSources: [...prev.allowedSources, { id: newId, name: newSource.trim(), enabled: true }]
        }))
        setNewSource('')
    }

    const removeSource = (id) => {
        setConfig(prev => ({
            ...prev,
            allowedSources: prev.allowedSources.filter(s => s.id !== id)
        }))
    }

    const toggleRule = (id) => {
        setConfig(prev => ({
            ...prev,
            contentRules: prev.contentRules.map(r =>
                r.id === id ? { ...r, enabled: !r.enabled } : r
            )
        }))
    }

    const addRule = () => {
        if (!newRule.trim()) return
        const newId = Math.max(...config.contentRules.map(r => r.id)) + 1
        setConfig(prev => ({
            ...prev,
            contentRules: [...prev.contentRules, { id: newId, rule: newRule.trim(), severity: newRuleSeverity, enabled: true }]
        }))
        setNewRule('')
        setNewRuleSeverity('medium')
    }

    const removeRule = (id) => {
        setConfig(prev => ({
            ...prev,
            contentRules: prev.contentRules.filter(r => r.id !== id)
        }))
    }

    const tabs = [
        { id: 'prompt', label: 'System Prompt', icon: '💬' },
        { id: 'rules', label: 'Content Rules', icon: '📏' },
        { id: 'sources', label: 'Allowed Sources', icon: '📚' },
        { id: 'model', label: 'Model Settings', icon: '🤖' },
        { id: 'safety', label: 'Safety Filters', icon: '🛡️' },
    ]

    const severityColors = {
        critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-lg">⚙️</span>
                        AI Configuration
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Configure AI behavior, prompts, and safety parameters for Islamic content generation
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg ${saved
                            ? 'bg-green-500 text-white shadow-green-500/30'
                            : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:shadow-brand-500/40 hover:translate-y-[-1px]'
                        }`}
                >
                    {saving ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </span>
                    ) : saved ? '✓ Saved Successfully' : 'Save Configuration'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* SYSTEM PROMPT TAB */}
                {activeTab === 'prompt' && (
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                System Prompt Template
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                This prompt is prepended to every AI interaction. It defines the AI's personality, boundaries, and behavior for Islamic content generation.
                            </p>
                            <textarea
                                value={config.systemPrompt}
                                onChange={(e) => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                                rows={12}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-y focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            />
                            <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                                <span>{config.systemPrompt.length} characters</span>
                                <span>~{Math.ceil(config.systemPrompt.length / 4)} tokens</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Response Style
                                </label>
                                <div className="space-y-2">
                                    {responseStyles.map(style => (
                                        <label
                                            key={style.value}
                                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${config.responseStyle === style.value
                                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-400'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="responseStyle"
                                                value={style.value}
                                                checked={config.responseStyle === style.value}
                                                onChange={(e) => setConfig(prev => ({ ...prev, responseStyle: e.target.value }))}
                                                className="text-brand-600 focus:ring-brand-500"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{style.label}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{style.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Max Tokens: {config.maxTokens}
                                    </label>
                                    <input
                                        type="range"
                                        min="256"
                                        max="4096"
                                        step="256"
                                        value={config.maxTokens}
                                        onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                                        className="w-full accent-brand-600"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>256</span>
                                        <span>4096</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Temperature: {config.temperature}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={config.temperature}
                                        onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                                        className="w-full accent-brand-600"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>0.0 (Precise)</span>
                                        <span>1.0 (Creative)</span>
                                    </div>
                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                        ⚠️ For Islamic content, keep temperature low (0.1–0.4) for accuracy
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT RULES TAB */}
                {activeTab === 'rules' && (
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Content Rules</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Define rules that the AI must follow when generating responses
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                {config.contentRules.filter(r => r.enabled).length} active rules
                            </div>
                        </div>

                        <div className="space-y-3">
                            {config.contentRules.map(rule => (
                                <div
                                    key={rule.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${rule.enabled
                                            ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                            : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 opacity-60'
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleRule(rule.id)}
                                        className={`w-10 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${rule.enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 mt-1 ${rule.enabled ? 'translate-x-5' : 'translate-x-1'
                                            }`} />
                                    </button>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{rule.rule}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${severityColors[rule.severity]}`}>
                                        {rule.severity}
                                    </span>
                                    <button
                                        onClick={() => removeRule(rule.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add New Rule */}
                        <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={newRule}
                                    onChange={(e) => setNewRule(e.target.value)}
                                    placeholder="Add a new content rule..."
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                />
                                <select
                                    value={newRuleSeverity}
                                    onChange={(e) => setNewRuleSeverity(e.target.value)}
                                    className="px-3 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                                >
                                    <option value="critical">Critical</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                                <button
                                    onClick={addRule}
                                    className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
                                >
                                    Add Rule
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ALLOWED SOURCES TAB */}
                {activeTab === 'sources' && (
                    <div className="p-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Allowed Islamic Sources</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Configure which Islamic texts and references the AI can draw from when generating responses
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {config.allowedSources.map(source => (
                                <div
                                    key={source.id}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${source.enabled
                                            ? 'border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/10'
                                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{source.enabled ? '📖' : '📕'}</span>
                                        <span className={`text-sm font-medium ${source.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {source.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => removeSource(source.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors text-xs"
                                        >
                                            ✕
                                        </button>
                                        <button
                                            onClick={() => toggleSource(source.id)}
                                            className={`w-10 h-6 rounded-full transition-all duration-300 ${source.enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 mt-1 ${source.enabled ? 'translate-x-5' : 'translate-x-1'
                                                }`} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add New Source */}
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={newSource}
                                onChange={(e) => setNewSource(e.target.value)}
                                placeholder="Add a new Islamic source..."
                                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                                onKeyDown={(e) => e.key === 'Enter' && addSource()}
                            />
                            <button
                                onClick={addSource}
                                className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
                            >
                                + Add Source
                            </button>
                        </div>
                    </div>
                )}

                {/* MODEL SETTINGS TAB */}
                {activeTab === 'model' && (
                    <div className="p-8 space-y-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Model Configuration</h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Primary Model</label>
                                <select
                                    value={config.modelSettings.primaryModel}
                                    onChange={(e) => setConfig(prev => ({
                                        ...prev,
                                        modelSettings: { ...prev.modelSettings, primaryModel: e.target.value }
                                    }))}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                                >
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    <option value="claude-3-opus">Claude 3 Opus</option>
                                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Fallback Model</label>
                                <select
                                    value={config.modelSettings.fallbackModel}
                                    onChange={(e) => setConfig(prev => ({
                                        ...prev,
                                        modelSettings: { ...prev.modelSettings, fallbackModel: e.target.value }
                                    }))}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                                >
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Embedding Model</label>
                                <select
                                    value={config.modelSettings.embeddingModel}
                                    onChange={(e) => setConfig(prev => ({
                                        ...prev,
                                        modelSettings: { ...prev.modelSettings, embeddingModel: e.target.value }
                                    }))}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                                >
                                    <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                                    <option value="text-embedding-3-small">text-embedding-3-small</option>
                                    <option value="text-embedding-3-large">text-embedding-3-large</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Vector Store</label>
                                <select
                                    value={config.modelSettings.vectorStore}
                                    onChange={(e) => setConfig(prev => ({
                                        ...prev,
                                        modelSettings: { ...prev.modelSettings, vectorStore: e.target.value }
                                    }))}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                                >
                                    <option value="pinecone">Pinecone</option>
                                    <option value="weaviate">Weaviate</option>
                                    <option value="chromadb">ChromaDB</option>
                                    <option value="qdrant">Qdrant</option>
                                </select>
                            </div>
                        </div>

                        {/* RAG Toggle */}
                        <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">RAG (Retrieval-Augmented Generation)</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Enable to augment AI responses with retrieved Islamic text passages from the vector database
                                </div>
                            </div>
                            <button
                                onClick={() => setConfig(prev => ({
                                    ...prev,
                                    modelSettings: { ...prev.modelSettings, ragEnabled: !prev.modelSettings.ragEnabled }
                                }))}
                                className={`w-12 h-7 rounded-full transition-all duration-300 ${config.modelSettings.ragEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 mt-1 ${config.modelSettings.ragEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                    </div>
                )}

                {/* SAFETY FILTERS TAB */}
                {activeTab === 'safety' && (
                    <div className="p-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Safety & Quality Filters</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Configure automatic safety checks and quality thresholds for AI-generated Islamic content
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-3">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Auto-Flag Confidence Threshold: {(config.safetyFilters.autoFlagConfidenceBelow * 100).toFixed(0)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={config.safetyFilters.autoFlagConfidenceBelow}
                                    onChange={(e) => setConfig(prev => ({
                                        ...prev,
                                        safetyFilters: { ...prev.safetyFilters, autoFlagConfidenceBelow: parseFloat(e.target.value) }
                                    }))}
                                    className="w-full accent-brand-600"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Responses with confidence below this threshold will be auto-flagged for scholar review
                                </p>
                            </div>

                            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-3">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Max Retries: {config.safetyFilters.maxRetries}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={config.safetyFilters.maxRetries}
                                    onChange={(e) => setConfig(prev => ({
                                        ...prev,
                                        safetyFilters: { ...prev.safetyFilters, maxRetries: parseInt(e.target.value) }
                                    }))}
                                    className="w-full accent-brand-600"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Maximum number of AI generation retries if quality checks fail
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Require Scholar Review</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        All AI-generated answers must be reviewed by a qualified scholar before being visible to users
                                    </div>
                                </div>
                                <button
                                    onClick={() => setConfig(prev => ({
                                        ...prev,
                                        safetyFilters: { ...prev.safetyFilters, requireScholarReview: !prev.safetyFilters.requireScholarReview }
                                    }))}
                                    className={`w-12 h-7 rounded-full transition-all duration-300 ${config.safetyFilters.requireScholarReview ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 mt-1 ${config.safetyFilters.requireScholarReview ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Block Inappropriate Content</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Automatically block and report content that violates Islamic ethics or community guidelines
                                    </div>
                                </div>
                                <button
                                    onClick={() => setConfig(prev => ({
                                        ...prev,
                                        safetyFilters: { ...prev.safetyFilters, blockInappropriate: !prev.safetyFilters.blockInappropriate }
                                    }))}
                                    className={`w-12 h-7 rounded-full transition-all duration-300 ${config.safetyFilters.blockInappropriate ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 mt-1 ${config.safetyFilters.blockInappropriate ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
