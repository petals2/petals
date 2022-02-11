export interface LoggedInSession {
  flags: {
    confirm_email_banner: boolean,
    gallery_comments_enabled: boolean,
    has_outstanding_email_confirmation: boolean,
    must_complete_registration: boolean,
    must_reset_password: boolean,
    project_commetns_enabled: boolean,
    show_welcome: boolean,
    unsupported_browser_banner: boolean,
    userprofile_comments_enables: boolean,
  },
  permissions: {
    admin: boolean,
    educator: boolean,
    educator_invitee: boolean,
    invited_scratcher: boolean,
    mute_status: boolean,
    new_scratcher: boolean,
    scratcher: boolean,
    social: boolean,
    student: boolean,
  },
  user: {
    banned: boolean,
    dateJoined: string,
    email: string,
    id: number,
    thumbnailUrl: string,
    token: string,
    username: string,
  }
}

export interface LoggedOutSession {
  flags: {
    gallery_comments_enabled: boolean,
    project_commetns_enabled: boolean,
    userprofile_comments_enables: boolean,
  }
}

export type Session = LoggedInSession | LoggedOutSession;
