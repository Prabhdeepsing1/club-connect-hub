import { supabase } from '../config/supabaseClient.js'

export async function getMe(req, res) {

    const accessToken = req.cookies['sb-access-token']
    const refreshToken = req.cookies['sb-refresh-token']

    if (!accessToken) return res.json({ user: null })

    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return res.status(500).json({ user: null, error: error.message })

    res.json({ user: { id: user.id, email: user.email } })

}