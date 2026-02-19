import React, { useEffect, useState } from 'react'
import api from '../api'
import Card from '../components/Card'

export default function SavedReflections() {
  const [list, setList] = useState([])

  useEffect(() => {
    api.get('/answers/saved/').then(r => {
      setList(r.data)
    }).catch(e => console.error(e))
  }, [])

  return (
    <div className="pt-24 max-w-4xl animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Your <span className="text-brand-600">Reflections</span></h1>
        <p className="text-slate-500 mt-2 text-lg">A private museum of insights you've saved for contemplation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map(item => (
          <Card key={item.id} className="relative bg-white border-0 shadow-soft hover:shadow-elevated transition-all duration-300 p-8 rounded-[2rem] group flex flex-col justify-between">
            <div className="absolute top-6 left-6 w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500 opacity-50 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div className="pt-10 mb-6">
              <div className="text-slate-700 leading-relaxed font-medium italic" dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                Saved on {new Date(item.created_at).toLocaleDateString()}
              </div>
              <button className="text-[10px] font-bold text-slate-300 hover:text-red-500 uppercase tracking-widest transition-colors">Delete</button>
            </div>
          </Card>
        ))}
        {list.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <h3 className="text-xl font-display font-bold text-slate-400 mb-2">Your library is empty</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">Insights you save from your guidance results will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
