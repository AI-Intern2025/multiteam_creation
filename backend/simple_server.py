import json
import time
import random
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading

class TeamGeneratorHandler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:3000')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_url = urlparse(self.path)
        
        if parsed_url.path == '/':
            self.send_json_response({
                "message": "Dream11 Multi Team Creator API", 
                "version": "1.0.0"
            })
        elif parsed_url.path == '/health':
            self.send_json_response({
                "status": "healthy", 
                "timestamp": time.time()
            })
        else:
            self.send_error_response(404, "Not Found")
    
    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/generate-teams':
            self.handle_generate_teams()
        else:
            self.send_error_response(404, "Not Found")
    
    def handle_generate_teams(self):
        """Handle team generation requests"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            # Validate request
            if 'players' not in request_data or 'strategy' not in request_data or 'teamCount' not in request_data:
                self.send_error_response(400, "Missing required fields")
                return
            
            players = request_data['players']
            strategy = request_data['strategy']
            team_count = request_data['teamCount']
            
            if team_count <= 0 or team_count > 50:
                self.send_error_response(400, "Team count must be between 1 and 50")
                return
            
            if len(players) < 11:
                self.send_error_response(400, "At least 11 players required")
                return
            
            # Generate teams
            start_time = time.time()
            teams = self.generate_teams(players, strategy, team_count)
            execution_time = (time.time() - start_time) * 1000
            
            response = {
                "teams": teams,
                "metadata": {
                    "totalGenerated": len(teams),
                    "validTeams": len([t for t in teams if t.get('isValid', True)]),
                    "uniqueTeams": len(teams),
                    "executionTime": execution_time
                }
            }
            
            self.send_json_response(response)
            
        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON")
        except Exception as e:
            self.send_error_response(500, str(e))
    
    def generate_teams(self, players, strategy, team_count):
        """Generate teams using simple algorithm"""
        teams = []
        
        # Filter available players
        available_players = [
            p for p in players 
            if p['id'] not in strategy.get('excludedPlayers', [])
        ]
        
        for i in range(team_count):
            team = self.generate_single_team(available_players, strategy, f"Team {i + 1}")
            teams.append(team)
        
        return teams
    
    def generate_single_team(self, available_players, strategy, team_name):
        """Generate a single team"""
        selected_players = []
        total_credits = 0
        
        # Add locked players first
        locked_players = strategy.get('lockedPlayers', [])
        for locked_id in locked_players:
            locked_player = next((p for p in available_players if p['id'] == locked_id), None)
            if locked_player and len(selected_players) < 11:
                selected_players.append(locked_player)
                total_credits += locked_player['credits']
        
        # Shuffle remaining players for variety
        remaining_players = [
            p for p in available_players 
            if p['id'] not in [sp['id'] for sp in selected_players]
        ]
        random.shuffle(remaining_players)
        
        # Count roles
        role_counts = {'WK': 0, 'BAT': 0, 'AR': 0, 'BOWL': 0}
        for player in selected_players:
            role_counts[player['role']] += 1
        
        # Fill remaining slots
        role_constraints = strategy.get('roleConstraints', {
            'WK': {'min': 1, 'max': 1},
            'BAT': {'min': 3, 'max': 5},
            'AR': {'min': 1, 'max': 4},
            'BOWL': {'min': 3, 'max': 5}
        })
        
        credit_range = strategy.get('creditRange', {'min': 70, 'max': 100})
        
        for player in remaining_players:
            if len(selected_players) >= 11:
                break
            
            # Check role constraints
            role_constraint = role_constraints.get(player['role'], {'max': 4})
            if role_counts[player['role']] >= role_constraint['max']:
                continue
            
            # Check credit constraints
            if total_credits + player['credits'] > credit_range['max']:
                continue
            
            selected_players.append(player)
            total_credits += player['credits']
            role_counts[player['role']] += 1
        
        # Select captain and vice-captain
        high_value_players = [
            p for p in selected_players 
            if p['credits'] >= 8
        ]
        high_value_players.sort(key=lambda x: x['credits'], reverse=True)
        
        captain = high_value_players[0]['id'] if high_value_players else selected_players[0]['id']
        vice_captain = high_value_players[1]['id'] if len(high_value_players) > 1 else selected_players[1]['id']
        
        # Validate team
        is_valid = self.validate_team(selected_players, total_credits)
        
        return {
            "id": f"team-{random.randint(1000, 9999)}",
            "name": team_name,
            "players": selected_players,
            "captain": captain,
            "viceCaptain": vice_captain,
            "totalCredits": total_credits,
            "isValid": is_valid,
            "validationErrors": [] if is_valid else ["Team validation failed"],
            "strategy": strategy.get('name', 'Custom Strategy')
        }
    
    def validate_team(self, players, total_credits):
        """Validate team composition"""
        if len(players) != 11:
            return False
        
        if total_credits > 100:
            return False
        
        # Count roles
        role_counts = {'WK': 0, 'BAT': 0, 'AR': 0, 'BOWL': 0}
        team_counts = {'team1': 0, 'team2': 0}
        
        for player in players:
            role_counts[player['role']] += 1
            team_counts[player['team']] += 1
        
        # Validate role constraints
        if role_counts['WK'] != 1:
            return False
        if role_counts['BAT'] < 3 or role_counts['BAT'] > 5:
            return False
        if role_counts['BOWL'] < 3 or role_counts['BOWL'] > 5:
            return False
        if role_counts['AR'] > 4:
            return False
        
        # Validate team balance
        if team_counts['team1'] < 1 or team_counts['team1'] > 7:
            return False
        if team_counts['team2'] < 1 or team_counts['team2'] > 7:
            return False
        
        return True
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:3000')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def send_error_response(self, status_code, message):
        """Send error response with CORS headers"""
        self.send_json_response({"detail": message}, status_code)
    
    def log_message(self, format, *args):
        """Override log message to reduce noise"""
        print(f"{self.address_string()} - {format % args}")

def run_server():
    """Run the HTTP server"""
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, TeamGeneratorHandler)
    
    print("🚀 Dream11 Team Generator API Server")
    print(f"📍 Server running on http://localhost:8000")
    print(f"🔗 CORS enabled for http://localhost:3000")
    print(f"⚡ Ready to generate teams!")
    print(f"🛑 Press Ctrl+C to stop\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Shutting down server...")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
