import { supabase } from '../config/supabaseClient.js'
import validator from 'validator'

export async function getAllMembers(req, res) {
    try {
        // Fetch all active members with their profiles
        const { data: members, error: membersError } = await supabase
            .from('member_profiles')
            .select(`
                id,
                roll_no,
                branch,
                year,
                github_username,
                interests,
                bio,
                joined_at,
                is_active,
                users!inner (
                    name,
                    email
                )
            `)
            .eq('is_active', true)
            .order('joined_at', { ascending: false })

        if (membersError) {
            throw membersError
        }

        // Fetch contribution stats for all members
        const memberIds = members.map(m => m.id)
        
        const { data: contributionStats, error: statsError } = await supabase
            .from('contributions')
            .select('member_id, status')
            .in('member_id', memberIds)

        if (statsError) {
            console.error('Error fetching contribution stats:', statsError)
        }

        // Aggregate contribution stats by member
        const statsMap = {}
        if (contributionStats) {
            contributionStats.forEach(contrib => {
                if (!statsMap[contrib.member_id]) {
                    statsMap[contrib.member_id] = {
                        totalPRs: 0,
                        mergedPRs: 0,
                        openPRs: 0,
                        closedPRs: 0
                    }
                }
                
                statsMap[contrib.member_id].totalPRs++
                
                if (contrib.status === 'merged') {
                    statsMap[contrib.member_id].mergedPRs++
                } else if (contrib.status === 'open') {
                    statsMap[contrib.member_id].openPRs++
                } else if (contrib.status === 'closed') {
                    statsMap[contrib.member_id].closedPRs++
                }
            })
        }

        // Format response
        const formattedMembers = members.map(member => ({
            id: member.id,
            name: member.users.name,
            email: member.users.email,
            github_username: member.github_username,
            branch: member.branch,
            year: member.year,
            joinedAt: member.joined_at,
            isActive: member.is_active,
            contributionStats: statsMap[member.id] || {
                totalPRs: 0,
                mergedPRs: 0,
                openPRs: 0,
                closedPRs: 0
            }
        }))

        res.status(200).json({
            success: true,
            members: formattedMembers,
            total: formattedMembers.length
        })

    } catch (err) {
        console.error('Get members error:', err.message)
        res.status(500).json({ error: `Failed to fetch members. ${err.message}` })
    }
}

export async function getCurrentMemberProfile(req, res) {
    try {
        const userId = req.user.id

        // Fetch member profile with user data
        const { data: profile, error: profileError } = await supabase
            .from('member_profiles')
            .select(`
                id,
                roll_no,
                branch,
                year,
                github_username,
                interests,
                bio,
                joined_at,
                is_active,
                users!inner (
                    name,
                    email
                )
            `)
            .eq('id', userId)
            .single()

        if (profileError) {
            if (profileError.code === 'PGRST116') {
                return res.status(404).json({ error: 'Member profile not found' })
            }
            throw profileError
        }

        // Fetch contribution statistics
        const { data: contributions, error: contribError } = await supabase
            .from('contributions')
            .select('id, status, repo_name, repo_owner, pr_title, pr_link, created_at')
            .eq('member_id', userId)
            .order('created_at', { ascending: false })

        if (contribError) {
            console.error('Error fetching contributions:', contribError)
        }

        // Calculate stats
        const stats = {
            totalPRs: 0,
            mergedPRs: 0,
            openPRs: 0,
            closedPRs: 0,
            issuesOpened: 0, // TODO: Implement when issues tracking is added
            repositories: []
        }

        const repoSet = new Set()

        if (contributions) {
            contributions.forEach(contrib => {
                stats.totalPRs++
                
                if (contrib.status === 'merged') {
                    stats.mergedPRs++
                } else if (contrib.status === 'open') {
                    stats.openPRs++
                } else if (contrib.status === 'closed') {
                    stats.closedPRs++
                }

                // Track unique repositories
                if (contrib.repo_owner && contrib.repo_name) {
                    repoSet.add(`${contrib.repo_owner}/${contrib.repo_name}`)
                }
            })
        }

        stats.repositories = Array.from(repoSet)

        // Get recent contributions (last 5)
        const recentContributions = contributions
            ? contributions.slice(0, 5).map(contrib => ({
                title: contrib.pr_title,
                repo: `${contrib.repo_owner}/${contrib.repo_name}`,
                status: contrib.status,
                createdAt: contrib.created_at,
                link: contrib.pr_link
            }))
            : []

        // Build avatar URL from GitHub username
        const avatarUrl = profile.github_username 
            ? `https://github.com/${profile.github_username}.png`
            : null

        // Format response
        res.status(200).json({
            id: profile.id,
            name: profile.users.name,
            email: profile.users.email,
            profile: {
                branch: profile.branch,
                year: profile.year,
                github_username: profile.github_username,
                interests: profile.interests || [],
                bio: profile.bio || '',
                avatar_url: avatarUrl
            },
            stats,
            recentContributions
        })

    } catch (err) {
        console.error('Get profile error:', err.message)
        res.status(500).json({ error: `Failed to fetch profile. ${err.message}` })
    }
}

export async function updateProfile(req, res) {
    try {
        // Get authenticated user ID from middleware
        const userId = req.user.id

        const { github_username, interests, bio } = req.body

        // Validate inputs
        if (github_username && !validator.matches(github_username, /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)) {
            return res.status(400).json({ error: 'Invalid GitHub username format' })
        }

        if (bio && bio.length > 500) {
            return res.status(400).json({ error: 'Bio must be 500 characters or less' })
        }

        if (interests && !Array.isArray(interests)) {
            return res.status(400).json({ error: 'Interests must be an array' })
        }

        // Build update object with only provided fields
        const updateData = {}
        if (github_username !== undefined) updateData.github_username = github_username.trim()
        if (interests !== undefined) updateData.interests = interests
        if (bio !== undefined) updateData.bio = bio.trim()

        // Add updated_at timestamp
        updateData.updated_at = new Date().toISOString()

        // Check if member profile exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from('member_profiles')
            .select('id')
            .eq('id', userId)
            .single()

        if (fetchError || !existingProfile) {
            return res.status(404).json({ error: 'Member profile not found' })
        }

        // Update the profile
        const { data, error: updateError } = await supabase
            .from('member_profiles')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single()

        if (updateError) {
            throw updateError
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile: {
                github_username: data.github_username,
                interests: data.interests,
                bio: data.bio,
                updated_at: data.updated_at
            }
        })

    } catch (err) {
        console.error('Profile update error:', err.message)
        res.status(500).json({ error: `Failed to update profile. ${err.message}` })
    }
}
