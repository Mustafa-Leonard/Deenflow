import React from 'react'

export default function Card({ children, className = '', onClick }) {
  return <div onClick={onClick} className={`bg-white dark:bg-slate-900 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300 ${className}`}>{children}</div>
}
