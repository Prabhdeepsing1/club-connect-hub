import { supabase } from '../config/supabaseClient.js'

export async function getNotifications(req, res) {
    try {
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        // Get all notifications for the user
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Count unread notifications
        const unreadCount = notifications.filter(n => !n.read).length

        // Format response
        const formattedNotifications = notifications.map(notification => ({
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            read: notification.read,
            createdAt: notification.created_at,
            data: notification.data || {}
        }))

        res.json({
            notifications: formattedNotifications,
            unreadCount
        })

    } catch (err) {
        console.error('Get notifications error:', err.message)
        res.status(500).json({ error: `Failed to fetch notifications. ${err.message}` })
    }
}

export async function markNotificationAsRead(req, res) {
    try {
        const { id } = req.params
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        // Verify notification belongs to user
        const { data: notification, error: fetchError } = await supabase
            .from('notifications')
            .select('user_id')
            .eq('id', id)
            .single()

        if (fetchError || !notification) {
            return res.status(404).json({ error: 'Notification not found' })
        }

        if (notification.user_id !== userId) {
            return res.status(403).json({ error: 'Access denied' })
        }

        // Mark as read
        const { error: updateError } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id)

        if (updateError) throw updateError

        res.json({ success: true, message: 'Notification marked as read' })

    } catch (err) {
        console.error('Mark notification as read error:', err.message)
        res.status(500).json({ error: `Failed to update notification. ${err.message}` })
    }
}

export async function markAllNotificationsAsRead(req, res) {
    try {
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        // Mark all as read
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false)

        if (error) throw error

        res.json({ success: true, message: 'All notifications marked as read' })

    } catch (err) {
        console.error('Mark all notifications as read error:', err.message)
        res.status(500).json({ error: `Failed to update notifications. ${err.message}` })
    }
}