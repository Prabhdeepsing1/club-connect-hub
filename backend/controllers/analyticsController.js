import { supabase } from '../config/supabaseClient.js'

export async function getAnalyticsOverview(req, res) {
    try {
        // Get total members count
        const { count: totalMembers, error: membersError } = await supabase
            .from('member_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)

        if (membersError) throw membersError

        // Get pending applications count
        const { count: pendingApplications, error: appsError } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

        if (appsError) throw appsError

        // Get active events count
        const { count: activeEvents, error: eventsError } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active')

        if (eventsError) throw eventsError

        // Get total PRs count
        const { count: totalPRs, error: prsError } = await supabase
            .from('contributions')
            .select('*', { count: 'exact', head: true })

        if (prsError) throw prsError

        // Calculate monthly growth (compare current month to last month)
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

        const { count: currentMonthMembers } = await supabase
            .from('member_profiles')
            .select('*', { count: 'exact', head: true })
            .gte('joined_at', currentMonthStart.toISOString())

        const { count: lastMonthMembers } = await supabase
            .from('member_profiles')
            .select('*', { count: 'exact', head: true })
            .gte('joined_at', lastMonthStart.toISOString())
            .lt('joined_at', currentMonthStart.toISOString())

        const growthRate = lastMonthMembers > 0 
            ? Math.round(((currentMonthMembers - lastMonthMembers) / lastMonthMembers) * 100)
            : 0
        const monthlyGrowth = `${growthRate >= 0 ? '+' : ''}${growthRate}%`

        // Get PR activity for last 6 months
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const { data: contributions, error: contribError } = await supabase
            .from('contributions')
            .select('created_at')
            .gte('created_at', sixMonthsAgo.toISOString())

        if (contribError) throw contribError

        // Group by month
        const monthlyActivity = {}
        contributions.forEach(c => {
            const date = new Date(c.created_at)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            monthlyActivity[monthKey] = (monthlyActivity[monthKey] || 0) + 1
        })

        const prActivity = Object.entries(monthlyActivity)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, count]) => ({ month, count }))

        res.json({
            overview: {
                totalMembers: totalMembers || 0,
                pendingApplications: pendingApplications || 0,
                activeEvents: activeEvents || 0,
                totalPRs: totalPRs || 0,
                monthlyGrowth
            },
            trends: {
                prActivity
            }
        })

    } catch (err) {
        console.error('Analytics overview error:', err.message)
        res.status(500).json({ 
            success: false,
            error: {
                code: 'ANALYTICS_ERROR',
                message: `Failed to fetch analytics overview. ${err.message}`
            }
        })
    }
}

export async function getPRStats(req, res) {
    try {
        const { startDate, endDate, status, repo } = req.query

        // Build query
        let query = supabase
            .from('contributions')
            .select('*')

        // Apply filters
        if (startDate) {
            query = query.gte('created_at', startDate)
        }
        if (endDate) {
            query = query.lte('created_at', endDate)
        }
        if (status) {
            query = query.eq('status', status)
        }
        if (repo) {
            query = query.eq('repo_name', repo)
        }

        const { data: contributions, error } = await query

        if (error) throw error

        // Calculate statistics
        const totalPRs = contributions.length
        const openPRs = contributions.filter(c => c.status === 'open').length
        const closedPRs = contributions.filter(c => c.status === 'closed').length
        const mergedPRs = contributions.filter(c => c.status === 'merged').length
        const mergeRate = totalPRs > 0 ? ((mergedPRs / totalPRs) * 100).toFixed(1) : 0

        // Repository breakdown
        const repoStats = {}
        contributions.forEach(c => {
            const repoKey = `${c.repo_owner}/${c.repo_name}`
            if (!repoStats[repoKey]) {
                repoStats[repoKey] = { total: 0, merged: 0, open: 0, closed: 0 }
            }
            repoStats[repoKey].total++
            if (c.status === 'merged') repoStats[repoKey].merged++
            if (c.status === 'open') repoStats[repoKey].open++
            if (c.status === 'closed') repoStats[repoKey].closed++
        })

        const repositoryBreakdown = Object.entries(repoStats)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10)
            .map(([repo, stats]) => ({ repository: repo, ...stats }))

        // Top contributors
        const memberStats = {}
        contributions.forEach(c => {
            if (!memberStats[c.member_id]) {
                memberStats[c.member_id] = { total: 0, merged: 0, score: 0 }
            }
            memberStats[c.member_id].total++
            if (c.status === 'merged') memberStats[c.member_id].merged++
            memberStats[c.member_id].score += (c.score || 0)
        })

        // Get member names
        const memberIds = Object.keys(memberStats)
        const { data: members } = await supabase
            .from('users')
            .select('id, name')
            .in('id', memberIds)

        const topContributors = Object.entries(memberStats)
            .sort((a, b) => b[1].score - a[1].score)
            .slice(0, 10)
            .map(([memberId, stats]) => {
                const member = members?.find(m => m.id === memberId)
                return {
                    memberId,
                    memberName: member?.name || 'Unknown',
                    totalPRs: stats.total,
                    mergedPRs: stats.merged,
                    totalScore: parseFloat(stats.score.toFixed(2))
                }
            })

        // Code stats
        const totalAdditions = contributions.reduce((sum, c) => sum + (c.additions || 0), 0)
        const totalDeletions = contributions.reduce((sum, c) => sum + (c.deletions || 0), 0)
        const totalChangedFiles = contributions.reduce((sum, c) => sum + (c.changed_files || 0), 0)
        const avgReviews = contributions.length > 0 
            ? (contributions.reduce((sum, c) => sum + (c.reviews_count || 0), 0) / contributions.length).toFixed(1)
            : 0

        res.json({
            summary: {
                totalPRs,
                openPRs,
                closedPRs,
                mergedPRs,
                mergeRate: `${mergeRate}%`
            },
            codeStats: {
                totalAdditions,
                totalDeletions,
                totalChangedFiles,
                avgReviewsPerPR: parseFloat(avgReviews)
            },
            repositoryBreakdown,
            topContributors,
            filters: {
                startDate: startDate || null,
                endDate: endDate || null,
                status: status || null,
                repo: repo || null
            }
        })

    } catch (err) {
        console.error('PR stats error:', err.message)
        res.status(500).json({ 
            success: false,
            error: {
                code: 'PR_STATS_ERROR',
                message: `Failed to fetch PR statistics. ${err.message}`
            }
        })
    }
}

export async function getMemberActivity(req, res) {
    try {
        const { startDate, endDate, limit = 20, page = 1 } = req.query

        // Get all members with their contribution counts
        const { data: members, error: membersError } = await supabase
            .from('member_profiles')
            .select(`
                id,
                github_username,
                joined_at,
                is_active,
                users!inner(name, email)
            `)
            .eq('is_active', true)

        if (membersError) throw membersError

        // Get contributions for each member
        let contributionsQuery = supabase
            .from('contributions')
            .select('member_id, status, score, created_at')

        if (startDate) {
            contributionsQuery = contributionsQuery.gte('created_at', startDate)
        }
        if (endDate) {
            contributionsQuery = contributionsQuery.lte('created_at', endDate)
        }

        const { data: contributions, error: contribError } = await contributionsQuery

        if (contribError) throw contribError

        // Aggregate by member
        const memberActivity = members.map(member => {
            const memberContribs = contributions.filter(c => c.member_id === member.id)
            const totalPRs = memberContribs.length
            const mergedPRs = memberContribs.filter(c => c.status === 'merged').length
            const openPRs = memberContribs.filter(c => c.status === 'open').length
            const totalScore = memberContribs.reduce((sum, c) => sum + (c.score || 0), 0)

            // Get last activity date
            const lastActivity = memberContribs.length > 0
                ? new Date(Math.max(...memberContribs.map(c => new Date(c.created_at))))
                : null

            return {
                memberId: member.id,
                memberName: member.users?.name || 'Unknown',
                email: member.users?.email,
                githubUsername: member.github_username,
                joinedAt: member.joined_at,
                activity: {
                    totalPRs,
                    mergedPRs,
                    openPRs,
                    totalScore: parseFloat(totalScore.toFixed(2)),
                    lastActivity: lastActivity?.toISOString() || null
                }
            }
        })

        // Sort by total score (most active first)
        memberActivity.sort((a, b) => b.activity.totalScore - a.activity.totalScore)

        // Pagination
        const offset = (page - 1) * limit
        const paginatedMembers = memberActivity.slice(offset, offset + parseInt(limit))

        res.json({
            members: paginatedMembers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: memberActivity.length
            },
            filters: {
                startDate: startDate || null,
                endDate: endDate || null
            },
            summary: {
                activeMembers: memberActivity.filter(m => m.activity.totalPRs > 0).length,
                inactiveMembers: memberActivity.filter(m => m.activity.totalPRs === 0).length,
                totalMembers: memberActivity.length
            }
        })

    } catch (err) {
        console.error('Member activity error:', err.message)
        res.status(500).json({ 
            success: false,
            error: {
                code: 'MEMBER_ACTIVITY_ERROR',
                message: `Failed to fetch member activity. ${err.message}`
            }
        })
    }
}