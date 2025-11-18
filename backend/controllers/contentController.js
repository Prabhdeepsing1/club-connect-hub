import { supabase } from '../config/supabaseClient.js'

export async function getAboutContent(req, res) {
    try {
        const { data, error } = await supabase
            .from('content')
            .select('*')
            .eq('page_key', 'about')
            .single()

        if (error) {
            // If no content exists yet, return empty structure
            if (error.code === 'PGRST116') {
                return res.json({
                    page_key: 'about',
                    sections: {},
                    updated_at: null
                })
            }
            throw error
        }

        res.json({
            page_key: data.page_key,
            sections: data.content_data || {},
            updated_at: data.updated_at,
            updated_by: data.updated_by
        })

    } catch (err) {
        console.error('Get about content error:', err.message)
        res.status(500).json({ error: `Failed to fetch about content. ${err.message}` })
    }
}

export async function updateAboutContent(req, res) {
    try {
        const { sections } = req.body
        const userId = req.user?.id

        if (!sections || typeof sections !== 'object') {
            return res.status(400).json({ error: 'Invalid content data. Sections object required.' })
        }

        // Check if content already exists
        const { data: existing } = await supabase
            .from('content')
            .select('id')
            .eq('page_key', 'about')
            .single()

        let result

        if (existing) {
            // Update existing content
            const { data, error } = await supabase
                .from('content')
                .update({
                    content_data: sections,
                    updated_by: userId,
                    updated_at: new Date().toISOString()
                })
                .eq('page_key', 'about')
                .select()
                .single()

            if (error) throw error
            result = data
        } else {
            // Insert new content
            const { data, error } = await supabase
                .from('content')
                .insert({
                    page_key: 'about',
                    section_key: 'main',
                    content_data: sections,
                    updated_by: userId
                })
                .select()
                .single()

            if (error) throw error
            result = data
        }

        res.json({
            success: true,
            message: 'About page content updated successfully',
            page_key: result.page_key,
            sections: result.content_data,
            updated_at: result.updated_at
        })

    } catch (err) {
        console.error('Update about content error:', err.message)
        res.status(500).json({ error: `Failed to update about content. ${err.message}` })
    }
}