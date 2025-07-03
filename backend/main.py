from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import time
import random
from enum import Enum
import re
import io
from PIL import Image
import base64

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

# OCR and Image Processing imports
from fastapi import File, UploadFile

# Uncomment these lines when you have Google Vision API set up
# from google.cloud import vision
# client = vision.ImageAnnotatorClient()

# Cricket-specific constants for better name recognition
EXCLUDED_WORDS = [
    'wicket', 'keeper', 'batter', 'bowler', 'rounder', 'captain', 'create',
    'team', 'credits', 'players', 'omkar', 'vindictive', 'dream11', 'match',
    'pts', 'sel', 'played', 'last', 'tomorrow', 'today', 'percentage', 'left',
    'upload', 'make', 'wicket-keepers', 'batters', 'all-rounders', 'bowlers'
]

def clean_player_name(name: str) -> str:
    """Clean and format player name"""
    cleaned = re.sub(r'[^\w\s.-]', '', name)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return ' '.join(word.capitalize() for word in cleaned.split())

def is_valid_player_name(name: str) -> bool:
    """Check if a name is likely a cricket player name"""
    if not name or len(name) < 3 or len(name) > 30:
        return False
    
    # Check against excluded words
    if any(word in name.lower() for word in EXCLUDED_WORDS):
        return False
    
    # Check if it contains only letters, spaces, dots, hyphens
    if not re.match(r'^[a-zA-Z\s.-]+$', name):
        return False
    
    # Check if it's not just numbers or percentages
    if re.match(r'^\d+%?$', name):
        return False
    
    return True

def extract_player_names_from_text(text: str) -> List[str]:
    """Extract player names from OCR text"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    player_names = []
    
    # Cricket name patterns
    patterns = [
        r'\b([A-Z][a-z]{0,2}\s+[A-Z][a-z]{3,})\b',  # S Hope, K Brathwaite
        r'\b([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,})\b',   # Virat Kohli
        r'\b([A-Z]{1,2}\s+[A-Z][a-z]{2,})\b',       # AB de Villiers
    ]
    
    for line in lines:
        # Skip obvious non-player lines
        if (len(line) < 3 or 
            re.match(r'^\d+$', line) or 
            re.match(r'^\d+%$', line) or
            re.match(r'^\d+\.\d+$', line) or
            re.match(r'^\d+:\d+$', line) or
            any(word in line.lower() for word in EXCLUDED_WORDS)):
            continue
        
        # Try each pattern
        for pattern in patterns:
            matches = re.findall(pattern, line)
            for match in matches:
                cleaned_name = clean_player_name(match)
                if is_valid_player_name(cleaned_name):
                    player_names.append(cleaned_name)
        
        # Also check if the whole line is a valid name
        if is_valid_player_name(line):
            cleaned_name = clean_player_name(line)
            if cleaned_name:
                player_names.append(cleaned_name)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_names = []
    for name in player_names:
        if name not in seen:
            seen.add(name)
            unique_names.append(name)
    
    return unique_names

# OCR Endpoints
@app.post("/extract-names/")
async def extract_names(file: UploadFile = File(...)):
    """Extract player names from uploaded image using OCR"""
    try:
        # Read image data
        image_data = await file.read()
        
        # Try to use pytesseract if available
        try:
            import pytesseract
            from PIL import Image
            
            # Open image
            image = Image.open(io.BytesIO(image_data))
            
            # Perform OCR
            extracted_text = pytesseract.image_to_string(image)
            
            # Extract player names from the OCR text
            player_names = extract_player_names_from_text(extracted_text)
            
            return {
                "success": True,
                "player_names": player_names,
                "count": len(player_names),
                "extracted_text": extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text,
                "message": "Player names extracted successfully using Tesseract OCR"
            }
            
        except ImportError:
            # Fallback: Basic text extraction simulation
            # This is a simplified approach that tries to extract names from common patterns
            return {
                "success": False,
                "message": "Tesseract OCR not installed. Please install pytesseract: pip install pytesseract",
                "player_names": [],
                "count": 0
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/extract-names-vision/")
async def extract_names_vision(file: UploadFile = File(...)):
    """Extract player names using Google Vision API"""
    try:
        # Read image data
        image_data = await file.read()
        
        # For now, we'll simulate Google Vision API response
        # In production, you would uncomment the Google Vision API code below
        
        # Simulate processing time
        import time
        time.sleep(1)
        
        # Parse the image using PIL for basic processing
        image = Image.open(io.BytesIO(image_data))
        
        # For now, return a simulated response with better extraction
        # In production, replace this with actual Google Vision API call
        
        # Simulate extracted text that would come from Google Vision API
        # This is a placeholder - in real implementation, you'd use:
        # from google.cloud import vision
        # client = vision.ImageAnnotatorClient()
        # image = vision.Image(content=image_data)
        # response = client.text_detection(image=image)
        # extracted_text = response.text_annotations[0].description
        
        # For demonstration, let's use a better mock response
        # In your actual implementation, you'll get this from Google Vision API
        mock_extracted_text = """
        S Hope
        WK • 8.5cr • WI
        
        J Inglis
        WK • 8cr • AUS
        
        K Brathwaite
        BAT • 8.5cr • WI
        
        U Khawaja
        BAT • 8cr • AUS
        
        K Carty
        BAT • 8cr • WI
        
        B Webster
        AR • 8cr • AUS
        
        J Greaves
        AR • 8cr • WI
        
        P Cummins
        BOWL • 8cr • AUS
        
        M Starc
        BOWL • 8cr • AUS
        
        A Joseph
        BOWL • 8cr • WI
        
        J Warrican
        BOWL • 8cr • WI
        """
        
        # Extract player names from the mock text
        player_names = extract_player_names_from_text(mock_extracted_text)
        
        return {
            "success": True,
            "player_names": player_names,
            "count": len(player_names),
            "extracted_text": mock_extracted_text.strip(),
            "message": "Player names extracted successfully using Google Vision API simulation"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/extract-names-tesseract/")
async def extract_names_tesseract(file: UploadFile = File(...)):
    """Extract player names using Tesseract OCR"""
    try:
        # Read image data
        image_data = await file.read()
        
        # Uncomment when pytesseract is installed
        """
        import pytesseract
        from PIL import Image
        
        # Open image
        image = Image.open(io.BytesIO(image_data))
        
        # Perform OCR
        extracted_text = pytesseract.image_to_string(image)
        
        # Extract player names
        player_names = extract_player_names_from_text(extracted_text)
        
        return {
            "success": True,
            "player_names": player_names,
            "count": len(player_names),
            "extracted_text": extracted_text,
            "message": "Player names extracted successfully using Tesseract"
        }
        """
        
        # Placeholder response
        return {
            "success": False,
            "message": "Tesseract OCR not configured. Please install pytesseract.",
            "player_names": [],
            "count": 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
