import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import Card from '../components/Card'
import TabBar from '../components/TabBar'

const TABS = ['Obligations', 'Ethics', 'Knowledge', 'Mistakes', 'Duas', 'Quran & Hadith', 'Reflections']

function mapTabToKey(tab) {
  return tab === 'Quran & Hadith' ? 'quran_hadith' : tab.toLowerCase()
}

export default function GuidanceResult() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [active, setActive] = useState(TABS[0])
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/guidance/${id}/`).then(r => setData(r.data)).catch(() => alert('Not found'))
  }, [id])

  if (!data) return <div className="pt-20">Loading...</div>

  const content = data.response_json || {}
  const tabsMap = {
    'Obligations': content.obligations || [],
    'Ethics': content.ethics || [],
    'Knowledge': content.knowledge || [],
    'Mistakes': content.mistakes || [],
    'Duas': content.duas || [],
    'Quran & Hadith': (content.quran || []).concat(content.hadith || []),
    'Reflections': content.reflections || [],
  }

  const saveItem = async (text) => {
    try {
      await api.post('/guidance/reflections/create/', {
        guidance: id,
        text: text
      })
      alert('Saved to reflections')
    } catch (e) {
      alert('Failed to save')
    }
  }

  return (
    <div className="pt-24 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-2">Analysis Result</div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Wisdom <span className="text-brand-600">Guidance</span></h1>
          <p className="text-slate-500 mt-2">Personalized insights based on your unique context.</p>
        </div>
        <Card className="py-2 px-6 flex items-center gap-4 bg-white shadow-soft border-slate-100">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 leading-none">Category</div>
            <div className="text-sm font-bold text-brand-600 mt-1 uppercase tracking-wider">{content.category || 'Analyzing...'}</div>
          </div>
        </Card>
      </div>

      <div className="mb-10 inline-flex p-1.5 bg-slate-100 rounded-[2rem] shadow-inner">
        <TabBar tabs={TABS} active={active} onChange={setActive} />
      </div>

      <div className="grid gap-6">
        {(tabsMap[active] || []).map((item, idx) => (
          <Card key={idx} className="group relative bg-white border-0 shadow-soft hover:shadow-elevated transition-all duration-300 p-8 rounded-[2rem] overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-brand-500 transition-colors"></div>
            <div className="pr-12">
              <div className="text-slate-700 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: typeof item === 'string' ? item : item.text || item }} />
            </div>
            <button
              onClick={() => saveItem(typeof item === 'string' ? item : item.text || item)}
              className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all bg-brand-50 text-brand-600 p-3 rounded-2xl hover:bg-brand-600 hover:text-white shadow-sm"
              title="Save to Reflections"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </Card>
        ))}
        {(!tabsMap[active] || tabsMap[active].length === 0) && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 italic font-medium">No items available in this category for this analysis.</p>
          </div>
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
        <button onClick={() => nav('/')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold uppercase tracking-widest text-xs transition-colors">
          Back to Dashboard
        </button>
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Educational Guidance Only</div>
      </div>
    </div>
  )
}
