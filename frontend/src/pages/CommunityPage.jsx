import React from 'react'
import PremiumEmptyState from '../components/Common/PremiumEmptyState'
import { Users2 } from 'lucide-react'

export default function CommunityPage() {
  return (
    <PremiumEmptyState 
      title="Islamic Community Hub"
      description="Connect with fellow believers, share reflections, and participate in global discussions. We are currently finalizing the moderation tools to ensure a safe and respectful environment."
      icon={Users2}
      badge="Coming Soon (Q3 2026)"
      actionText="Back to Dashboard"
      actionLink="/app/dashboard"
    />
  )
}
