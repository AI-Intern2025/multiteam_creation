from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import time
import random
from enum import Enum

# Initialize FastAPI app
app = FastAPI(title="Dream11 Multi Team Creator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enums
class Role(str, Enum):
    WK = "WK"
    BAT = "BAT"
    AR = "AR"
    BOWL = "BOWL"

class Team(str, Enum):
    TEAM1 = "team1"
    TEAM2 = "team2"

# Pydantic Models
class Player(BaseModel):
    id: str
    name: str
    team: Team
    role: Role
    credits: float
    points: Optional[float] = None
    isLocked: bool = False
    isExcluded: bool = False

class CaptainDistribution(BaseModel):
    playerId: str
    percentage: int

class RoleConstraints(BaseModel):
    WK: Dict[str, int]
    BAT: Dict[str, int]
    AR: Dict[str, int]
    BOWL: Dict[str, int]

class Strategy(BaseModel):
    id: str
    name: str
    preset: Optional[str] = None
    lockedPlayers: List[str] = []
    excludedPlayers: List[str] = []
    captainDistribution: List[CaptainDistribution] = []
    roleConstraints: RoleConstraints
    creditRange: Dict[str, float]
    uniquenessWeight: float
    narratives: List[str] = []

class GeneratedTeam(BaseModel):
    id: str
    name: str
    players: List[Player]
    captain: str
    viceCaptain: str
    totalCredits: float
    isValid: bool
    validationErrors: List[str]
    strategy: Optional[str] = None

class GenerateTeamsRequest(BaseModel):
    players: List[Player]
    strategy: Strategy
    teamCount: int

class GenerateTeamsResponse(BaseModel):
    teams: List[GeneratedTeam]
    metadata: Dict[str, Any]

# Team Generation Logic
class TeamGenerator:
    def __init__(self):
        self.validation_rules = self._init_validation_rules()
    
    def _init_validation_rules(self):
        return {
            'team_size': lambda team: len(team['players']) == 11,
            'credit_limit': lambda team: team['totalCredits'] <= 100,
            'wicket_keeper': lambda team: len([p for p in team['players'] if p['role'] == 'WK']) == 1,
            'min_batsmen': lambda team: len([p for p in team['players'] if p['role'] == 'BAT']) >= 3,
            'max_batsmen': lambda team: len([p for p in team['players'] if p['role'] == 'BAT']) <= 5,
            'min_bowlers': lambda team: len([p for p in team['players'] if p['role'] == 'BOWL']) >= 3,
            'max_bowlers': lambda team: len([p for p in team['players'] if p['role'] == 'BOWL']) <= 5,
            'max_all_rounders': lambda team: len([p for p in team['players'] if p['role'] == 'AR']) <= 4,
            'team_balance': lambda team: self._check_team_balance(team),
        }
    
    def _check_team_balance(self, team):
        team1_count = len([p for p in team['players'] if p['team'] == 'team1'])
        team2_count = len([p for p in team['players'] if p['team'] == 'team2'])
        return 1 <= team1_count <= 7 and 1 <= team2_count <= 7
    
    def validate_team(self, team_dict):
        errors = []
        for rule_name, rule_func in self.validation_rules.items():
            if not rule_func(team_dict):
                errors.append(f"Validation failed: {rule_name}")
        
        return {
            'isValid': len(errors) == 0,
            'errors': errors
        }
    
    def generate_teams(self, players: List[Player], strategy: Strategy, team_count: int):
        start_time = time.time()
        generated_teams = []
        
        # Filter available players
        available_players = [
            p for p in players 
            if p.id not in strategy.excludedPlayers
        ]
        
        for i in range(team_count):
            team = self._generate_single_team(
                available_players, 
                strategy, 
                f"Team {i + 1}"
            )
            generated_teams.append(team)
        
        # Validate all teams
        valid_teams = []
        for team in generated_teams:
            team_dict = {
                'players': [p.dict() for p in team.players],
                'totalCredits': team.totalCredits
            }
            validation = self.validate_team(team_dict)
            team.isValid = validation['isValid']
            team.validationErrors = validation['errors']
            valid_teams.append(team)
        
        execution_time = (time.time() - start_time) * 1000
        
        return {
            'teams': valid_teams,
            'metadata': {
                'totalGenerated': len(valid_teams),
                'validTeams': len([t for t in valid_teams if t.isValid]),
                'uniqueTeams': len(valid_teams),  # Simplified for now
                'executionTime': execution_time
            }
        }
    
    def _generate_single_team(self, available_players: List[Player], strategy: Strategy, team_name: str):
        selected_players = []
        total_credits = 0
        
        # Add locked players first
        for locked_id in strategy.lockedPlayers:
            locked_player = next((p for p in available_players if p.id == locked_id), None)
            if locked_player and len(selected_players) < 11:
                selected_players.append(locked_player)
                total_credits += locked_player.credits
        
        # Shuffle remaining players for variety
        remaining_players = [
            p for p in available_players 
            if p.id not in [sp.id for sp in selected_players]
        ]
        random.shuffle(remaining_players)
        
        # Fill remaining slots based on role constraints
        role_counts = {role.value: 0 for role in Role}
        for player in selected_players:
            role_counts[player.role] += 1
        
        # Try to fill remaining slots
        for player in remaining_players:
            if len(selected_players) >= 11:
                break
            
            # Check role constraints
            role_constraint = strategy.roleConstraints.dict()[player.role]
            if role_counts[player.role] >= role_constraint['max']:
                continue
            
            # Check credit constraints
            if total_credits + player.credits > strategy.creditRange['max']:
                continue
            
            selected_players.append(player)
            total_credits += player.credits
            role_counts[player.role] += 1
        
        # Select captain and vice-captain
        high_value_players = [
            p for p in selected_players 
            if p.credits >= 8
        ]
        high_value_players.sort(key=lambda x: x.credits, reverse=True)
        
        captain = high_value_players[0].id if high_value_players else selected_players[0].id
        vice_captain = high_value_players[1].id if len(high_value_players) > 1 else selected_players[1].id
        
        return GeneratedTeam(
            id=f"team-{random.randint(1000, 9999)}",
            name=team_name,
            players=selected_players,
            captain=captain,
            viceCaptain=vice_captain,
            totalCredits=total_credits,
            isValid=True,  # Will be validated later
            validationErrors=[],
            strategy=strategy.name
        )

# Initialize generator
team_generator = TeamGenerator()

# API Routes
@app.get("/")
async def root():
    return {"message": "Dream11 Multi Team Creator API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}

@app.post("/generate-teams", response_model=GenerateTeamsResponse)
async def generate_teams(request: GenerateTeamsRequest):
    try:
        if request.teamCount <= 0 or request.teamCount > 50:
            raise HTTPException(status_code=400, detail="Team count must be between 1 and 50")
        
        if len(request.players) < 11:
            raise HTTPException(status_code=400, detail="At least 11 players required")
        
        result = team_generator.generate_teams(
            request.players,
            request.strategy,
            request.teamCount
        )
        
        return GenerateTeamsResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate-team")
async def validate_team(team: GeneratedTeam):
    try:
        team_dict = {
            'players': [p.dict() for p in team.players],
            'totalCredits': team.totalCredits
        }
        validation = team_generator.validate_team(team_dict)
        return validation
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/player-stats/{player_id}")
async def get_player_stats(player_id: str):
    # Mock player stats - replace with real data
    return {
        "playerId": player_id,
        "recentForm": random.uniform(0, 10),
        "averagePoints": random.uniform(20, 80),
        "selectedBy": random.uniform(5, 95),
        "matchHistory": []
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
