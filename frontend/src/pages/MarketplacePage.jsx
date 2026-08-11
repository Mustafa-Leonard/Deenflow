import React from 'react'
import PremiumEmptyState from '../components/Common/PremiumEmptyState'
import { ShoppingBag } from 'lucide-react'

export default function MarketplacePage() {
  return (
    <PremiumEmptyState 
      title="DeenMarket"
      description="The definitive ecosystem for Halal commerce. Shop for literature, prayer accessories, and ethical lifestyle products directly from verified Muslim artisans."
      icon={ShoppingBag}
      badge="Under Construction"
      actionText="Return to App"
      actionLink="/app/dashboard"
    />
  )
}
