import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

import { db, players, matches, type NewPlayer } from '../src/db'

// PAK vs SA Players
const pakSaPlayers: NewPlayer[] = [
  // PAK Players
  {
    name: 'B Azam',
    fullName: 'Babar Azam',
    team: 'PAK',
    role: 'BAT',
    credits: 10.0,
    selectionPercentage: 85,
    points: 142,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'M Rizwan',
    fullName: 'Mohammad Rizwan',
    team: 'PAK',
    role: 'WK',
    credits: 9.5,
    selectionPercentage: 78,
    points: 124,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'F Zaman',
    fullName: 'Fakhar Zaman',
    team: 'PAK',
    role: 'BAT',
    credits: 9.0,
    selectionPercentage: 65,
    points: 98,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'S Masood',
    fullName: 'Shan Masood',
    team: 'PAK',
    role: 'BAT',
    credits: 8.5,
    selectionPercentage: 52,
    points: 76,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'I Ahmed',
    fullName: 'Iftikhar Ahmed',
    team: 'PAK',
    role: 'AR',
    credits: 8.0,
    selectionPercentage: 48,
    points: 68,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'S Afridi',
    fullName: 'Shaheen Afridi',
    team: 'PAK',
    role: 'BOWL',
    credits: 9.5,
    selectionPercentage: 72,
    points: 118,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm fast',
    isPlayingToday: true
  },
  {
    name: 'H Rauf',
    fullName: 'Haris Rauf',
    team: 'PAK',
    role: 'BOWL',
    credits: 8.5,
    selectionPercentage: 56,
    points: 82,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'N Shah',
    fullName: 'Naseem Shah',
    team: 'PAK',
    role: 'BOWL',
    credits: 8.0,
    selectionPercentage: 44,
    points: 64,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'S Nawaz',
    fullName: 'Shadab Khan',
    team: 'PAK',
    role: 'AR',
    credits: 8.5,
    selectionPercentage: 58,
    points: 89,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm leg-break',
    isPlayingToday: true
  },
  {
    name: 'M Nawaz',
    fullName: 'Mohammad Nawaz',
    team: 'PAK',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 42,
    points: 58,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: true
  },
  {
    name: 'A Salman',
    fullName: 'Agha Salman',
    team: 'PAK',
    role: 'BAT',
    credits: 7.0,
    selectionPercentage: 34,
    points: 46,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  // SA Players
  {
    name: 'Q de Kock',
    fullName: 'Quinton de Kock',
    team: 'SA',
    role: 'WK',
    credits: 9.5,
    selectionPercentage: 82,
    points: 128,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'T Bavuma',
    fullName: 'Temba Bavuma',
    team: 'SA',
    role: 'BAT',
    credits: 8.5,
    selectionPercentage: 58,
    points: 86,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'R Hendricks',
    fullName: 'Reeza Hendricks',
    team: 'SA',
    role: 'BAT',
    credits: 8.0,
    selectionPercentage: 54,
    points: 78,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'D Miller',
    fullName: 'David Miller',
    team: 'SA',
    role: 'BAT',
    credits: 9.0,
    selectionPercentage: 68,
    points: 104,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'M Jansen',
    fullName: 'Marco Jansen',
    team: 'SA',
    role: 'AR',
    credits: 8.5,
    selectionPercentage: 62,
    points: 94,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'K Rabada',
    fullName: 'Kagiso Rabada',
    team: 'SA',
    role: 'BOWL',
    credits: 9.5,
    selectionPercentage: 76,
    points: 122,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'A Nortje',
    fullName: 'Anrich Nortje',
    team: 'SA',
    role: 'BOWL',
    credits: 8.5,
    selectionPercentage: 58,
    points: 88,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'T Shamsi',
    fullName: 'Tabraiz Shamsi',
    team: 'SA',
    role: 'BOWL',
    credits: 8.0,
    selectionPercentage: 52,
    points: 76,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm wrist-spin',
    isPlayingToday: true
  },
  {
    name: 'K Maharaj',
    fullName: 'Keshav Maharaj',
    team: 'SA',
    role: 'BOWL',
    credits: 7.5,
    selectionPercentage: 44,
    points: 62,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: true
  },
  {
    name: 'G Coetzee',
    fullName: 'Gerald Coetzee',
    team: 'SA',
    role: 'BOWL',
    credits: 7.0,
    selectionPercentage: 38,
    points: 54,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'W Mulder',
    fullName: 'Wiaan Mulder',
    team: 'SA',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 42,
    points: 58,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  }
]

// NZ vs SL Players
const nzSlPlayers: NewPlayer[] = [
  // NZ Players
  {
    name: 'T Latham',
    fullName: 'Tom Latham',
    team: 'NZ',
    role: 'WK',
    credits: 9.0,
    selectionPercentage: 72,
    points: 112,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'D Conway',
    fullName: 'Devon Conway',
    team: 'NZ',
    role: 'BAT',
    credits: 9.5,
    selectionPercentage: 78,
    points: 124,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'K Williamson',
    fullName: 'Kane Williamson',
    team: 'NZ',
    role: 'BAT',
    credits: 10.0,
    selectionPercentage: 84,
    points: 138,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'D Mitchell',
    fullName: 'Daryl Mitchell',
    team: 'NZ',
    role: 'AR',
    credits: 8.5,
    selectionPercentage: 64,
    points: 96,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'T Boult',
    fullName: 'Trent Boult',
    team: 'NZ',
    role: 'BOWL',
    credits: 9.0,
    selectionPercentage: 68,
    points: 108,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'T Southee',
    fullName: 'Tim Southee',
    team: 'NZ',
    role: 'BOWL',
    credits: 8.5,
    selectionPercentage: 58,
    points: 88,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'M Santner',
    fullName: 'Mitchell Santner',
    team: 'NZ',
    role: 'AR',
    credits: 8.0,
    selectionPercentage: 54,
    points: 82,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: true
  },
  {
    name: 'L Ferguson',
    fullName: 'Lockie Ferguson',
    team: 'NZ',
    role: 'BOWL',
    credits: 8.0,
    selectionPercentage: 48,
    points: 72,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'M Henry',
    fullName: 'Matt Henry',
    team: 'NZ',
    role: 'BOWL',
    credits: 7.5,
    selectionPercentage: 42,
    points: 64,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'G Phillips',
    fullName: 'Glenn Phillips',
    team: 'NZ',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 46,
    points: 68,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'R Ravindra',
    fullName: 'Rachin Ravindra',
    team: 'NZ',
    role: 'AR',
    credits: 8.0,
    selectionPercentage: 52,
    points: 78,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: true
  },
  // SL Players
  {
    name: 'K Mendis',
    fullName: 'Kusal Mendis',
    team: 'SL',
    role: 'WK',
    credits: 9.0,
    selectionPercentage: 74,
    points: 118,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'P Nissanka',
    fullName: 'Pathum Nissanka',
    team: 'SL',
    role: 'BAT',
    credits: 8.5,
    selectionPercentage: 62,
    points: 94,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'D de Silva',
    fullName: 'Dhananjaya de Silva',
    team: 'SL',
    role: 'AR',
    credits: 8.0,
    selectionPercentage: 58,
    points: 86,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'C Asalanka',
    fullName: 'Charith Asalanka',
    team: 'SL',
    role: 'BAT',
    credits: 7.5,
    selectionPercentage: 48,
    points: 72,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: true
  },
  {
    name: 'W Hasaranga',
    fullName: 'Wanindu Hasaranga',
    team: 'SL',
    role: 'AR',
    credits: 9.0,
    selectionPercentage: 76,
    points: 122,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm leg-break',
    isPlayingToday: true
  },
  {
    name: 'L Kumara',
    fullName: 'Lahiru Kumara',
    team: 'SL',
    role: 'BOWL',
    credits: 8.0,
    selectionPercentage: 52,
    points: 78,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'M Theekshana',
    fullName: 'Maheesh Theekshana',
    team: 'SL',
    role: 'BOWL',
    credits: 8.5,
    selectionPercentage: 64,
    points: 96,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'D Shanaka',
    fullName: 'Dasun Shanaka',
    team: 'SL',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 44,
    points: 64,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'A Mathews',
    fullName: 'Angelo Mathews',
    team: 'SL',
    role: 'AR',
    credits: 7.0,
    selectionPercentage: 38,
    points: 54,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'B Rajapaksa',
    fullName: 'Bhanuka Rajapaksa',
    team: 'SL',
    role: 'BAT',
    credits: 7.5,
    selectionPercentage: 42,
    points: 62,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'N Pradeep',
    fullName: 'Nuwan Pradeep',
    team: 'SL',
    role: 'BOWL',
    credits: 7.0,
    selectionPercentage: 36,
    points: 48,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  }
]

// BAN vs AFG Players
const banAfgPlayers: NewPlayer[] = [
  // BAN Players
  {
    name: 'T Iqbal',
    fullName: 'Tamim Iqbal',
    team: 'BAN',
    role: 'BAT',
    credits: 9.0,
    selectionPercentage: 68,
    points: 104,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'L Das',
    fullName: 'Liton Das',
    team: 'BAN',
    role: 'WK',
    credits: 8.5,
    selectionPercentage: 62,
    points: 94,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'M Hasan',
    fullName: 'Mahmudullah Hasan',
    team: 'BAN',
    role: 'AR',
    credits: 8.0,
    selectionPercentage: 54,
    points: 82,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'S Hossain',
    fullName: 'Shakib Al Hasan',
    team: 'BAN',
    role: 'AR',
    credits: 9.5,
    selectionPercentage: 78,
    points: 128,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: true
  },
  {
    name: 'M Rahman',
    fullName: 'Mustafizur Rahman',
    team: 'BAN',
    role: 'BOWL',
    credits: 8.5,
    selectionPercentage: 58,
    points: 88,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'T Ahmed',
    fullName: 'Taskin Ahmed',
    team: 'BAN',
    role: 'BOWL',
    credits: 8.0,
    selectionPercentage: 52,
    points: 78,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'M Miraz',
    fullName: 'Mehidy Hasan Miraz',
    team: 'BAN',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 46,
    points: 68,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'A Haque',
    fullName: 'Ariful Haque',
    team: 'BAN',
    role: 'BAT',
    credits: 7.0,
    selectionPercentage: 38,
    points: 54,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'N Hasan',
    fullName: 'Nasum Ahmed',
    team: 'BAN',
    role: 'BOWL',
    credits: 7.0,
    selectionPercentage: 34,
    points: 48,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: true
  },
  {
    name: 'S Sarkar',
    fullName: 'Soumya Sarkar',
    team: 'BAN',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 42,
    points: 62,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'M Joy',
    fullName: 'Mahedi Hasan Joy',
    team: 'BAN',
    role: 'BAT',
    credits: 6.5,
    selectionPercentage: 28,
    points: 38,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  // AFG Players
  {
    name: 'R Gurbaz',
    fullName: 'Rahmanullah Gurbaz',
    team: 'AFG',
    role: 'WK',
    credits: 8.5,
    selectionPercentage: 64,
    points: 96,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'I Zadran',
    fullName: 'Ibrahim Zadran',
    team: 'AFG',
    role: 'BAT',
    credits: 8.0,
    selectionPercentage: 56,
    points: 84,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'H Shahidi',
    fullName: 'Hashmatullah Shahidi',
    team: 'AFG',
    role: 'BAT',
    credits: 7.5,
    selectionPercentage: 48,
    points: 72,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'M Nabi',
    fullName: 'Mohammad Nabi',
    team: 'AFG',
    role: 'AR',
    credits: 8.5,
    selectionPercentage: 62,
    points: 94,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'R Khan',
    fullName: 'Rashid Khan',
    team: 'AFG',
    role: 'AR',
    credits: 9.5,
    selectionPercentage: 82,
    points: 132,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm leg-break',
    isPlayingToday: true
  },
  {
    name: 'M Ur Rahman',
    fullName: 'Mujeeb Ur Rahman',
    team: 'AFG',
    role: 'BOWL',
    credits: 8.0,
    selectionPercentage: 54,
    points: 82,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'N Kharoti',
    fullName: 'Noor Ahmad Kharoti',
    team: 'AFG',
    role: 'BOWL',
    credits: 7.5,
    selectionPercentage: 44,
    points: 64,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm wrist-spin',
    isPlayingToday: true
  },
  {
    name: 'F Farooqi',
    fullName: 'Fazalhaq Farooqi',
    team: 'AFG',
    role: 'BOWL',
    credits: 7.0,
    selectionPercentage: 38,
    points: 54,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'A Omarzai',
    fullName: 'Azmatullah Omarzai',
    team: 'AFG',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 42,
    points: 62,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'G Naib',
    fullName: 'Gulbadin Naib',
    team: 'AFG',
    role: 'AR',
    credits: 7.0,
    selectionPercentage: 34,
    points: 48,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'N Masood',
    fullName: 'Najibullah Masood',
    team: 'AFG',
    role: 'BAT',
    credits: 6.5,
    selectionPercentage: 28,
    points: 38,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  }
]

async function seedRemainingPlayers() {
  try {
    console.log('🌱 Adding remaining players for PAK vs SA, NZ vs SL, and BAN vs AFG...')
    
    // Get match IDs for reference
    const allMatches = await db.select().from(matches)
    console.log('📊 Found matches:', allMatches.map(m => `${m.team1} vs ${m.team2}`).join(', '))
    
    // Add PAK vs SA players
    console.log('🏏 Adding PAK vs SA players...')
    const pakSaInserted = await db.insert(players).values(pakSaPlayers).returning()
    console.log(`✅ Added ${pakSaInserted.length} PAK vs SA players`)
    
    // Add NZ vs SL players
    console.log('🏏 Adding NZ vs SL players...')
    const nzSlInserted = await db.insert(players).values(nzSlPlayers).returning()
    console.log(`✅ Added ${nzSlInserted.length} NZ vs SL players`)
    
    // Add BAN vs AFG players
    console.log('🏏 Adding BAN vs AFG players...')
    const banAfgInserted = await db.insert(players).values(banAfgPlayers).returning()
    console.log(`✅ Added ${banAfgInserted.length} BAN vs AFG players`)
    
    const totalAdded = pakSaInserted.length + nzSlInserted.length + banAfgInserted.length
    console.log(`\n🎉 Successfully added ${totalAdded} additional players!`)
    
    // Verify total count
    const allPlayers = await db.select().from(players)
    console.log(`📊 Total players in database: ${allPlayers.length}`)
    
  } catch (error) {
    console.error('❌ Error adding remaining players:', error)
    throw error
  }
}

// Run the seeding
seedRemainingPlayers()
  .then(() => {
    console.log('✅ Additional seeding completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Additional seeding failed:', error)
    process.exit(1)
  })
