import React from 'react'
import { useAppSelector } from '../hooks/redux'
import { Users, TrendingUp } from 'lucide-react'

const CommunitySidebar: React.FC = () => {
    const { communities } = useAppSelector((state) => state.communities)

    return (
        <div className="space-y-6">
            {/* Popular Communities */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    <span>Popular Communities</span>
                </h3>

                <div className="space-y-3">
                    {communities.slice(0, 5).map((community) => (
                        <div key={community.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{community.name}</p>
                                    <p className="text-xs text-gray-500">{community.member_count} members</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                    <a href="/create" className="block w-full btn-primary text-center">
                        Share Your Story
                    </a>
                    <button className="block w-full btn-secondary text-center">
                        Find Support
                    </button>
                </div>
            </div>

            {/* Safety Reminder */}
            <div className="card bg-safe-light border-safe">
                <h3 className="text-sm font-semibold text-safe-dark mb-2">Safe Space Reminder</h3>
                <p className="text-xs text-safe-dark">
                    This is a judgment-free zone. Be kind, supportive, and respectful to all community members.
                </p>
            </div>
        </div>
    )
}

export default CommunitySidebar 