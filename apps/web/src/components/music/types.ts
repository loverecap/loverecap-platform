export interface TrackResult {
  videoId: string
  title: string
  artist: string
  thumbnail: string
  duration: string
}

export interface SelectedTrack extends TrackResult {
  provider: 'youtube'
}
