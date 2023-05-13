from flask import request, jsonify, Blueprint 
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from models.users import User

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    email = request.json.get("email")
    username= request.json.get("username")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).one_or_none()

    if user is not None:
        return jsonify(message='email exist')

    hashed_password = generate_password_hash(password, method="sha256")

    user = User(email=email, username=username, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify(message='user created')

@auth.route('/login', methods=['POST'])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email = email).one_or_none()

    if user is not None and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.user_id)
        refresh_token = create_refresh_token(identity=user.user_id)
        response =jsonify(message='success', 
                          access_token=access_token, 
                          refresh_token=refresh_token
                          )
        return response, 200
    else:
        return jsonify(message='login failed'), 401
    
@auth.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify(access_token=access_token)