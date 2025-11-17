import { supabase } from '../config/supabaseClient.js';


/*
TODO
 ### GET `/api/events/member/:memberId`
**Purpose**: Get events for specific member (participated/participating)
**Access**: Member (own data) or Admin

### GET `/api/leaderboards/:eventId`
**Purpose**: Get leaderboard for event (FR-62, FR-63)
**Access**: All users (during event), Members always

**Response (200)**:
```json
{
  "event": {
    "id": 1,
    "title": "Bug Blitz 2025",
    "currentRanking": true
  },
  "leaderboard": [
    {
      "rank": 1,
      "memberId": 5,
      "name": "Alice Johnson",
      "totalPRs": 28,
      "mergedPRs": 24,
      "totalScore": 285.5,
      "repositories": ["org/project1", "org/project2"],
      "lastPRDate": "2025-11-12"
    },
    {
      "rank": 2,
      "memberId": 21,
      "name": "Bob Smith",
      "totalPRs": 31,
      "mergedPRs": 21,
      "totalScore": 265.0,
      "repositories": ["org/project3"],
      "lastPRDate": "2025-11-11"
    }
  ],
  "userRank": {
    "rank": 15,
    "score": 95,
    "prs": 12
  }
}
  */

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
    // const data = req.body;
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