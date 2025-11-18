import { supabase } from '../config/supabaseClient.js'

export async function getGsocOrgs(req, res) {
    try {
        const { category, year, tech, search, limit = 20, page = 1 } = req.query

        // Build query
        let query = supabase
            .from('gsoc_orgs')
            .select('*', { count: 'exact' })

        // Apply filters
        if (category) {
            query = query.eq('category', category)
        }

        if (year) {
            query = query.eq('last_year_participated', parseInt(year))
        }

        if (tech) {
            query = query.contains('technologies', [tech])
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
        }

        // Pagination
        const offset = (page - 1) * limit
        query = query
            .order('name', { ascending: true })
            .range(offset, offset + limit - 1)

        const { data, error, count } = await query

        if (error) throw error

        // Format response
        const organizations = data.map(org => ({
            id: org.id,
            name: org.name,
            category: org.category,
            technologies: org.technologies || [],
            repoLinks: org.repo_links || [],
            description: org.description,
            pastIdeas: org.past_ideas || [],
            contributionGuidelines: org.contribution_guidelines,
            lastYearParticipated: org.last_year_participated,
            tags: org.tags || []
        }))

        // Get unique categories from all organizations
        const { data: allOrgs } = await supabase
            .from('gsoc_orgs')
            .select('category')

        const categories = [...new Set(allOrgs?.map(o => o.category).filter(Boolean))]

        res.json({
            organizations,
            categories,
            totalOrgs: count || 0,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count || 0
            },
            filters: {
                category: category || null,
                year: year || null,
                tech: tech || null,
                search: search || null
            }
        })

    } catch (err) {
        console.error('Get GSoC organizations error:', err.message)
        res.status(500).json({ error: `Failed to fetch GSoC organizations. ${err.message}` })
    }
}

export async function getGsocOrgById(req, res) {
    try {
        const { id } = req.params

        const { data, error } = await supabase
            .from('gsoc_orgs')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        if (!data) {
            return res.status(404).json({ error: 'Organization not found' })
        }

        // Format response
        const organization = {
            id: data.id,
            name: data.name,
            category: data.category,
            technologies: data.technologies || [],
            repoLinks: data.repo_links || [],
            description: data.description,
            pastIdeas: data.past_ideas || [],
            contributionGuidelines: data.contribution_guidelines,
            lastYearParticipated: data.last_year_participated,
            tags: data.tags || [],
            createdAt: data.created_at,
            updatedAt: data.updated_at
        }

        res.json(organization)

    } catch (err) {
        console.error('Get GSoC organization by ID error:', err.message)
        res.status(500).json({ error: `Failed to fetch organization. ${err.message}` })
    }
}