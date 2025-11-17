import { supabase } from '../config/supabaseClient.js'

export async function requireAuth(req, res, next) {

    const accessToken = req.cookies['sb-access-token'];
    const refreshToken = req.cookies['sb-refresh-token'];

    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

    req.user = user;
    next();

}

export async function requireAdmin(req, res, next) {

    const userId = req.user.id;
    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

    if (error) {
        return res.status(403).json({ error })
    }
    if ( !data ) {
        return res.status(403).json({ error: 'Not allowed' })
    }

    if (data.role !== 'admin') {
        return res.status(403).json({ error: 'Admin only' })
    }

    next();
}