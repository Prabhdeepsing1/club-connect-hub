import validator from 'validator'
import { supabase } from '../config/supabaseClient.js'

export async function registerUser(req, res) {

let { name, email, password } = req.body
if ( !name || !email || !password ) {
    return res.status(400).json({ error: 'All fields are required.' })
}

name = name.trim()
email = email.trim()

if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
}

    try {

        const { data: signupData, error: signupError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: false
        })

        if (signupError) { throw signupError }

        await supabase.auth.admin.inviteUserByEmail(email);
        // TODO: change invite user email to mimic confirmation email since it replicates functionality

        const userId = signupData.user.id
        const { error: insertError } = await supabase
        .from('users')
        .insert({
            id: userId,
            name
        })

        if (insertError) { throw insertError }

        res.status(201).json({ message: 'User registered successfully!' })

    } catch (err) {
        console.error('Registration error:', err.message)
        res.status(500).json({ error: `Registration failed. ${err.message}` })
    }

}

export async function loginUser(req, res) {

    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })

    if (!validator.isEmail(email)) {
       return res.status(400).json({ error: 'Invalid email format' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return res.status(401).json({ error: error.message })

    const session = data.session
    if (!session) return res.status(500).json({ error: 'No session returned' })

    res.cookie('sb-access-token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: session.expires_in * 1000,
    })
    res.cookie('sb-refresh-token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        // optional: longer expiry
    })

    res.json({ user: { id: data.user.id, email: data.user.email } })
}


export async function logoutUser(req, res)  {

    res.clearCookie('sb-access-token')
    res.clearCookie('sb-refresh-token')
    res.json({ ok: true })

}