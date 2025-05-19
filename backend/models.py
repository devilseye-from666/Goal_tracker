from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


from extensions import db



class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(50), unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    goals = db.relationship('Goal', back_populates='user', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return str(self.id)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }


    @property
    def is_active(self):
        return self.active

class Goal(db.Model):
    __tablename__ = 'goals'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    target_value = db.Column(db.Float)
    current_value = db.Column(db.Float, default=0.0)
    deadline = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    user = db.relationship('User', back_populates='goals')
    plans = db.relationship('Plan', back_populates='goal', cascade='all, delete-orphan')
    tips = db.relationship('Tip', back_populates='goal', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'target_value': self.target_value,
            'current_value': self.current_value,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id,
            'plans': [plan.to_dict() for plan in self.plans],
            'tips': [tip.to_dict() for tip in self.tips]
        }


class Plan(db.Model):
    __tablename__ = 'plans'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    goal_id = db.Column(db.Integer, db.ForeignKey('goals.id'), nullable=False)
    goal = db.relationship('Goal', back_populates='plans')

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'completed': self.completed,
            'goal_id': self.goal_id
        }

class Tip(db.Model):
    __tablename__ = 'tips'
    id = db.Column(db.Integer, primary_key=True)
    advice = db.Column(db.Text, nullable=False)
    source = db.Column(db.String(200))
    goal_id = db.Column(db.Integer, db.ForeignKey('goals.id'), nullable=False)
    goal = db.relationship('Goal', back_populates='tips')

    def to_dict(self):
        return {
            'id': self.id,
            'advice': self.advice,
            'source': self.source,
            'goal_id': self.goal_id
        }
