from flask import Flask
from extensions import db, login_manager
from flask_cors import CORS

app = Flask(__name__)

# Configure app BEFORE calling CORS
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///goal_tracking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.secret_key = 'Top_Secret'

# Initialize CORS with allowed origins AFTER app is created
CORS(app, origins=["https://goal-tracker-lime.vercel.app"])

db.init_app(app)
login_manager.init_app(app)
login_manager.login_view = 'login'

from models import User  # safe now because db exists
from routes import *

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=8000)
