import { supabase } from '../config/supabaseClient.js'

/*
    TODO:

    Member
    POST /applications
    GET /me/application
    PATCH /me/application

    Admin
    PATCH /applications/:id
    DELETE /applications/:id

*/

export async function getAllApplications( req, res ) {

    try {

        const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .select('*');

        if (applicationError) { throw applicationError }


        res.status(201).json(applicationData);

    } catch (err) {
        console.error('Application fetch error:', err.message)
        res.status(500).json({ error: `Application fetch failed. ${err.message}` })
    }

}

export async function getApplicationById( req, res ) {

    const { id } = req.params;

    try {

        const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id);

        if (applicationError) { throw applicationError }

        res.status(201).json(applicationData);

    } catch (err) {
        console.error('Application fetch error:', err.message)
        res.status(500).json({ error: `Application fetch failed. ${err.message}` })
    }

}
