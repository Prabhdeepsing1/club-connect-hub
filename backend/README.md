# vosc backend routes

- supabase config files in `./config`

- controllers in `./controllers`
    - `./authController.js`
    - `./meController.js`

- routes files in `./routes`
    - `./auth.js`
    - `./me.js`

- middleware in `./middleware`
    - `./requireAuth.js`

## TODO

-  supabase auth requests 
    - [X] POST `/register`
    - [X] POST `/login`
    - [X] POST `/logout`
    - [X] GET `/me`
    
- role: public/user

    - application

        - [ ] POST /applications
        - [ ] GET /me/application
        - [ ] PATCH /me/application

    - [ ] get events list
    - [ ] get member list
    - [ ] get member profile

- role: admin/core-member

    - application
    
        - [X] GET /applications/
        - [X] GET /applications/:id
        - [ ] PATCH /applications/:id
        - [ ] DELETE /applications/:id

    - [ ] make announcement
    - [ ] manage event

## run 

- create .env as
```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

- run `pnpm install`
- run `pnpm run dev`
