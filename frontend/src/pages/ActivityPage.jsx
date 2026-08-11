import React from 'react'
import PremiumEmptyState from '../components/Common/PremiumEmptyState'
import { Activity } from 'lucide-react'

export default function ActivityPage() {
  return (
    <PremiumEmptyState 
      title="Activity & Points"
      description="Track your spiritual growth, earn rewards for consistency, and visualize your progress on the path of knowledge. Your personal growth analytics are being calculated."
      icon={Activity}
      badge="Coming Soon"
      actionText="Back to Journey"
      actionLink="/app/dashboard"
    />
  )
}
