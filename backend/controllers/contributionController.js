import { supabase } from '../config/supabaseClient.js'

export async function getContributions(req, res) {
    try {
        const { memberId, status, repo, eventId, limit = 20, page = 1 } = req.query
        const userRole = req.user?.role
        const currentUserId = req.user?.id

        // Build query
        let query = supabase
            .from('contributions')
            .select(`
                *,
                member_profiles!inner(id, github_username),
                users!inner(name)
            `, { count: 'exact' })

        // Access control: members can only see their own contributions
        if (userRole !== 'admin') {
            if (memberId && memberId !== currentUserId) {
                return res.status(403).json({ error: 'Access denied' })
            }
            query = query.eq('member_id', currentUserId)
        } else if (memberId) {
            query = query.eq('member_id', memberId)
        }

        // Apply filters
        if (status) {
            query = query.eq('status', status)
        }
        if (repo) {
            query = query.eq('repo_name', repo)
        }
        if (eventId) {
            query = query.eq('event_id', eventId)
        }

        // Pagination
        const offset = (page - 1) * limit
        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        const { data, error, count } = await query

        if (error) throw error

        // Format response
        const contributions = data.map(item => ({
            id: item.id,
            memberId: item.member_id,
            memberName: item.users?.name || 'Unknown',
            repoName: item.repo_name,
            repoOwner: item.repo_owner,
            prNumber: item.pr_number,
            prTitle: item.pr_title,
            prLink: item.pr_link,
            status: item.status,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            mergedAt: item.merged_at,
            reviewsCount: item.reviews_count || 0,
            commentsCount: item.comments_count || 0,
            additions: item.additions || 0,
            deletions: item.deletions || 0,
            changedFiles: item.changed_files || 0,
            labels: item.labels || [],
            score: item.score || 0
        }))

        res.json({
            contributions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count || 0
            },
            filters: {
                status: status || null,
                repo: repo || null,
                eventId: eventId || null
            }
        })

    } catch (err) {
        console.error('Get contributions error:', err.message)
        res.status(500).json({ error: `Failed to fetch contributions. ${err.message}` })
    }
}

export async function getContributionStats(req, res) {
    try {
        const { memberId } = req.query
        const userRole = req.user?.role
        const currentUserId = req.user?.id

        // Access control: members can only see their own stats
        let targetMemberId = currentUserId
        if (userRole !== 'admin') {
            if (memberId && memberId !== currentUserId) {
                return res.status(403).json({ error: 'Access denied' })
            }
        } else if (memberId) {
            targetMemberId = memberId
        }

        // Get all contributions for the member
        const { data: contributions, error } = await supabase
            .from('contributions')
            .select('*')
            .eq('member_id', targetMemberId)

        if (error) throw error

        // Calculate aggregated statistics
        const totalPRs = contributions.length
        const openPRs = contributions.filter(c => c.status === 'open').length
        const closedPRs = contributions.filter(c => c.status === 'closed').length
        const mergedPRs = contributions.filter(c => c.status === 'merged').length

        const totalAdditions = contributions.reduce((sum, c) => sum + (c.additions || 0), 0)
        const totalDeletions = contributions.reduce((sum, c) => sum + (c.deletions || 0), 0)
        const totalChangedFiles = contributions.reduce((sum, c) => sum + (c.changed_files || 0), 0)
        const totalScore = contributions.reduce((sum, c) => sum + (c.score || 0), 0)

        // Get unique repositories
        const repositories = [...new Set(contributions.map(c => `${c.repo_owner}/${c.repo_name}`))]

        // Get repository breakdown
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

        const repositoryBreakdown = Object.entries(repoStats).map(([repo, stats]) => ({
            repository: repo,
            ...stats
        }))

        // Calculate monthly activity (last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const monthlyActivity = {}
        contributions.forEach(c => {
            const date = new Date(c.created_at)
            if (date >= sixMonthsAgo) {
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                monthlyActivity[monthKey] = (monthlyActivity[monthKey] || 0) + 1
            }
        })

        const activityTrend = Object.entries(monthlyActivity)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, count]) => ({ month, count }))

        // Get recent contributions (last 5)
        const recentContributions = contributions
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map(c => ({
                id: c.id,
                title: c.pr_title,
                repo: `${c.repo_owner}/${c.repo_name}`,
                status: c.status,
                createdAt: c.created_at,
                prLink: c.pr_link
            }))

        res.json({
            memberId: targetMemberId,
            overview: {
                totalPRs,
                openPRs,
                closedPRs,
                mergedPRs,
                mergeRate: totalPRs > 0 ? ((mergedPRs / totalPRs) * 100).toFixed(1) : 0,
                totalScore: parseFloat(totalScore.toFixed(2))
            },
            codeStats: {
                totalAdditions,
                totalDeletions,
                totalChangedFiles,
                netChanges: totalAdditions - totalDeletions
            },
            repositories: {
                total: repositories.length,
                list: repositories,
                breakdown: repositoryBreakdown
            },
            activityTrend,
            recentContributions
        })

    } catch (err) {
        console.error('Get contribution stats error:', err.message)
        res.status(500).json({ error: `Failed to fetch contribution stats. ${err.message}` })
    }
}