import { supabase } from '../config/supabaseClient.js';

export async function getMemberEvents(req, res) {
    try {
        const { memberId } = req.params
        const currentUserId = req.user.id

        // Check authorization: member can only view own data, or must be admin
        if (currentUserId !== memberId) {
            // Check if current user is admin
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', currentUserId)
                .single()

            if (userError || !userData || userData.role !== 'admin') {
                return res.status(403).json({ 
                    error: 'You can only view your own event participation, or you must be an admin' 
                })
            }
        }

        // Verify the member exists
        const { data: memberProfile, error: memberError } = await supabase
            .from('member_profiles')
            .select('id, github_username, users!inner(name, email)')
            .eq('id', memberId)
            .single()

        if (memberError || !memberProfile) {
            return res.status(404).json({ error: 'Member not found' })
        }

        // Fetch all event participations for this member
        const { data: participations, error: participationError } = await supabase
            .from('event_participants')
            .select(`
                id,
                event_id,
                joined_at,
                total_score,
                rank,
                events!inner (
                    id,
                    title,
                    description,
                    type,
                    start_date,
                    end_date,
                    status,
                    pr_tracking_enabled,
                    max_participants
                )
            `)
            .eq('member_id', memberId)
            .order('joined_at', { ascending: false })

        if (participationError) {
            throw participationError
        }

        if (!participations || participations.length === 0) {
            return res.status(200).json({
                memberId: memberId,
                memberName: memberProfile.users.name,
                events: [],
                totalEvents: 0
            })
        }

        // Get event IDs for contribution stats
        const eventIds = participations.map(p => p.event_id)

        // Fetch contributions for all these events
        const { data: contributions, error: contribError } = await supabase
            .from('contributions')
            .select('event_id, status')
            .eq('member_id', memberId)
            .in('event_id', eventIds)

        if (contribError) {
            console.error('Error fetching contributions:', contribError)
        }

        // Aggregate contribution stats by event
        const eventStatsMap = {}
        if (contributions) {
            contributions.forEach(contrib => {
                if (!eventStatsMap[contrib.event_id]) {
                    eventStatsMap[contrib.event_id] = {
                        totalPRs: 0,
                        mergedPRs: 0,
                        openPRs: 0
                    }
                }

                eventStatsMap[contrib.event_id].totalPRs++

                if (contrib.status === 'merged') {
                    eventStatsMap[contrib.event_id].mergedPRs++
                } else if (contrib.status === 'open') {
                    eventStatsMap[contrib.event_id].openPRs++
                }
            })
        }

        // Categorize events
        const now = new Date()
        const categorizedEvents = {
            participating: [], // Currently active events
            participated: []   // Past events
        }

        participations.forEach(participation => {
            const event = participation.events
            const eventEnd = new Date(event.end_date)
            const isActive = now <= eventEnd && event.status === 'active'

            const stats = eventStatsMap[event.id] || {
                totalPRs: 0,
                mergedPRs: 0,
                openPRs: 0
            }

            const eventData = {
                eventId: event.id,
                title: event.title,
                description: event.description,
                type: event.type,
                startDate: event.start_date,
                endDate: event.end_date,
                status: event.status,
                joinedAt: participation.joined_at,
                totalScore: parseFloat(participation.total_score) || 0,
                rank: participation.rank,
                prStats: {
                    totalPRs: stats.totalPRs,
                    mergedPRs: stats.mergedPRs,
                    openPRs: stats.openPRs
                }
            }

            if (isActive) {
                categorizedEvents.participating.push(eventData)
            } else {
                categorizedEvents.participated.push(eventData)
            }
        })

        // Response
        res.status(200).json({
            memberId: memberId,
            memberName: memberProfile.users.name,
            events: {
                participating: categorizedEvents.participating,
                participated: categorizedEvents.participated
            },
            totalEvents: participations.length,
            stats: {
                totalEventsParticipated: categorizedEvents.participated.length,
                currentlyParticipating: categorizedEvents.participating.length
            }
        })

    } catch (err) {
        console.error('Get member events error:', err.message)
        res.status(500).json({ error: `Failed to fetch member events. ${err.message}` })
    }
}

export async function getEventLeaderboard(req, res) {
    try {
        const { eventId } = req.params
        const userId = req.user?.id // Optional - for userRank if authenticated

        // Fetch event details
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('id, title, start_date, end_date, status, scoring_rules, pr_tracking_enabled')
            .eq('id', eventId)
            .single()

        if (eventError || !event) {
            return res.status(404).json({ error: 'Event not found' })
        }

        // Check access permissions
        const now = new Date()
        const eventStart = new Date(event.start_date)
        const eventEnd = new Date(event.end_date)
        const isEventActive = now >= eventStart && now <= eventEnd

        // Allow access if: event is active OR user is authenticated member
        if (!isEventActive && !userId) {
            return res.status(403).json({ 
                error: 'Leaderboard is only accessible during the event or to authenticated members' 
            })
        }

        // Fetch all participants with their contributions for this event
        const { data: participants, error: participantsError } = await supabase
            .from('event_participants')
            .select(`
                id,
                member_id,
                total_score,
                rank,
                member_profiles!inner (
                    id,
                    github_username,
                    users!inner (
                        name
                    )
                )
            `)
            .eq('event_id', eventId)
            .order('total_score', { ascending: false })

        if (participantsError) {
            throw participantsError
        }

        if (!participants || participants.length === 0) {
            return res.status(200).json({
                event: {
                    id: event.id,
                    title: event.title,
                    currentRanking: isEventActive
                },
                leaderboard: [],
                userRank: null
            })
        }

        // Get member IDs for contributions query
        const memberIds = participants.map(p => p.member_id)

        // Fetch contributions for all participants in this event
        const { data: contributions, error: contribError } = await supabase
            .from('contributions')
            .select('member_id, status, repo_owner, repo_name, created_at, score')
            .eq('event_id', eventId)
            .in('member_id', memberIds)

        if (contribError) {
            console.error('Error fetching contributions:', contribError)
        }

        // Aggregate contribution data by member
        const memberStatsMap = {}
        
        if (contributions) {
            contributions.forEach(contrib => {
                if (!memberStatsMap[contrib.member_id]) {
                    memberStatsMap[contrib.member_id] = {
                        totalPRs: 0,
                        mergedPRs: 0,
                        openPRs: 0,
                        repositories: new Set(),
                        lastPRDate: null
                    }
                }

                const stats = memberStatsMap[contrib.member_id]
                stats.totalPRs++

                if (contrib.status === 'merged') {
                    stats.mergedPRs++
                } else if (contrib.status === 'open') {
                    stats.openPRs++
                }

                // Track unique repositories
                if (contrib.repo_owner && contrib.repo_name) {
                    stats.repositories.add(`${contrib.repo_owner}/${contrib.repo_name}`)
                }

                // Track latest PR date
                const prDate = new Date(contrib.created_at)
                if (!stats.lastPRDate || prDate > stats.lastPRDate) {
                    stats.lastPRDate = prDate
                }
            })
        }

        // Build leaderboard with rankings
        const leaderboard = participants.map((participant, index) => {
            const stats = memberStatsMap[participant.member_id] || {
                totalPRs: 0,
                mergedPRs: 0,
                openPRs: 0,
                repositories: new Set(),
                lastPRDate: null
            }

            return {
                rank: index + 1,
                memberId: participant.member_id,
                name: participant.member_profiles.users.name,
                totalPRs: stats.totalPRs,
                mergedPRs: stats.mergedPRs,
                totalScore: parseFloat(participant.total_score) || 0,
                repositories: Array.from(stats.repositories),
                lastPRDate: stats.lastPRDate ? stats.lastPRDate.toISOString().split('T')[0] : null
            }
        })

        // Find user's rank if authenticated
        let userRank = null
        if (userId) {
            const userParticipant = leaderboard.find(p => p.memberId === userId)
            if (userParticipant) {
                userRank = {
                    rank: userParticipant.rank,
                    score: userParticipant.totalScore,
                    prs: userParticipant.totalPRs
                }
            }
        }

        // Response
        res.status(200).json({
            event: {
                id: event.id,
                title: event.title,
                currentRanking: isEventActive
            },
            leaderboard,
            userRank
        })

    } catch (err) {
        console.error('Get leaderboard error:', err.message)
        res.status(500).json({ error: `Failed to fetch leaderboard. ${err.message}` })
    }
}

export async function getAllEvents(req,res){
    try{
        const {data: eventsData, error: err} = await supabase
        .from('events')
        .select('*')

        if(err){throw err}
        res.status(201).json(eventsData);
    }catch(err){
        res.status(500).json({error: err});
    }
}

export async function addEvent(req,res){
    const { title, description, type, startDate, endDate, prTrackingEnabled, scoringRules, maxParticipants, resources } = req.body;
    try{
        const {error: err} = await supabase
        .from('events')
        .insert({
            title,
            description,
            type,
            start_date: startDate,
            end_date: endDate,
            pr_tracking_enabled: prTrackingEnabled,
            scoring_rules: scoringRules,
            max_participants: maxParticipants,
            resources
        })
        if(err) {throw err}
        res.status(201).json({message: 'Event added'})
    }
    catch(err){
        res.status(500).json({error: err});
    }
}