from flask import request, jsonify
from flask_login import login_required, current_user, login_user, logout_user
from datetime import datetime
from app import app, db
from models import User , Goal , Tip , Plan

# ========================
# Authentication Routes
# ========================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Basic input validation
    if not data.get('email') or not data.get('password') or not data.get('username'):
        return jsonify({'error': 'Missing email, username, or password'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        email=data['email'],
        username=data.get('username')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify(user.to_dict())
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'})

# ========================
# Goal Routes
# ========================

@app.route('/api/goals', methods=['POST'])
@login_required
def create_goal():
    data = request.get_json()
    goal = Goal(
        title=data['title'],
        description=data.get('description'),
        target_value=data['target_value'],
        deadline=datetime.fromisoformat(data['deadline']) if data.get('deadline') else None,
        user_id=current_user.id
    )
    db.session.add(goal)
    db.session.commit()
    return jsonify(goal.to_dict()), 201

@app.route('/api/goals', methods=['GET'])
@login_required
def get_goals():
    goals = Goal.query.filter_by(user_id=current_user.id).all()
    return jsonify([goal.to_dict() for goal in goals])

@app.route('/api/goals/<int:goal_id>', methods=['GET'])
@login_required
def get_goal(goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first_or_404()
    return jsonify(goal.to_dict())

@app.route('/api/goals/<int:goal_id>', methods=['PUT'])
@login_required
def update_goal(goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first_or_404()
    data = request.get_json()
    
    goal.title = data.get('title', goal.title)
    goal.description = data.get('description', goal.description)
    goal.target_value = data.get('target_value', goal.target_value)
    goal.deadline = datetime.fromisoformat(data['deadline']) if data.get('deadline') else goal.deadline
    
    db.session.commit()
    return jsonify(goal.to_dict())

@app.route('/api/goals/<int:goal_id>', methods=['DELETE'])
@login_required
def delete_goal(goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first_or_404()
    db.session.delete(goal)
    db.session.commit()
    return jsonify({'message': 'Goal deleted successfully'})

# ========================
# Progress Tracking
# ========================

@app.route('/api/goals/<int:goal_id>/progress', methods=['PATCH'])
@login_required
def update_progress(goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first_or_404()
    data = request.get_json()
    
    if 'current_value' in data:
        goal.current_value = data['current_value']
    if 'increment' in data:
        goal.current_value += data['increment']
    
    db.session.commit()
    return jsonify(goal.to_dict())

# ========================
# Plan Routes
# ========================

@app.route('/api/goals/<int:goal_id>/plans', methods=['POST'])
@login_required
def create_plan(goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first_or_404()
    data = request.get_json()
    
    plan = Plan(
        content=data['content'],
        goal_id=goal.id
    )
    
    db.session.add(plan)
    db.session.commit()
    return jsonify(plan.to_dict()), 201

@app.route('/api/plans/<int:plan_id>', methods=['PUT'])
@login_required
def update_plan(plan_id):
    plan = Plan.query.join(Goal).filter(
        Plan.id == plan_id,
        Goal.user_id == current_user.id
    ).first_or_404()
    
    data = request.get_json()
    plan.content = data.get('content', plan.content)
    plan.completed = data.get('completed', plan.completed)
    
    db.session.commit()
    return jsonify(plan.to_dict())

@app.route('/api/plans/<int:plan_id>', methods=['DELETE'])
@login_required
def delete_plan(plan_id):
    plan = Plan.query.join(Goal).filter(
        Plan.id == plan_id,
        Goal.user_id == current_user.id
    ).first_or_404()
    
    db.session.delete(plan)
    db.session.commit()
    return jsonify({'message': 'Plan deleted successfully'})

# ========================
# Tip Routes
# ========================

@app.route('/api/goals/<int:goal_id>/tips', methods=['POST'])
@login_required
def create_tip(goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=current_user.id).first_or_404()
    data = request.get_json()
    
    tip = Tip(
        advice=data['advice'],
        source=data.get('source'),
        goal_id=goal.id
    )
    
    db.session.add(tip)
    db.session.commit()
    return jsonify(tip.to_dict()), 201

@app.route('/api/tips/<int:tip_id>', methods=['PUT'])
@login_required
def update_tip(tip_id):
    tip = Tip.query.join(Goal).filter(
        Tip.id == tip_id,
        Goal.user_id == current_user.id
    ).first_or_404()
    
    data = request.get_json()
    tip.advice = data.get('advice', tip.advice)
    tip.source = data.get('source', tip.source)
    
    db.session.commit()
    return jsonify(tip.to_dict())

@app.route('/api/tips/<int:tip_id>', methods=['DELETE'])
@login_required
def delete_tip(tip_id):
    tip = Tip.query.join(Goal).filter(
        Tip.id == tip_id,
        Goal.user_id == current_user.id
    ).first_or_404()
    
    db.session.delete(tip)
    db.session.commit()
    return jsonify({'message': 'Tip deleted successfully'})

# ========================
# Additional Routes
# ========================

@app.route('/api/goals/<int:goal_id>/plans', methods=['GET'])
@login_required
def get_plans(goal_id):
    Goal.query.filter_by(id=goal_id, user_id=current_user.id).first_or_404()
    plans = Plan.query.filter_by(goal_id=goal_id).all()
    return jsonify([plan.to_dict() for plan in plans])

@app.route('/api/goals/<int:goal_id>/tips', methods=['GET'])
@login_required
def get_tips(goal_id):
    Goal.query.filter_by(id=goal_id, user_id=current_user.id).first_or_404()
    tips = Tip.query.filter_by(goal_id=goal_id).all()
    return jsonify([tip.to_dict() for tip in tips])

