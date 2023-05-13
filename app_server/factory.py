from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta

import os

from auth.routes import auth
from extensions import jwt, db

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET")

    username = os.getenv('POSTGRES_USERNAME')
    password = os.getenv('POSTGRES_PASSWORD')
    dbname = os.getenv('POSTGRES_DB')
    url = os.getenv('POSTGRES_URL')
    port = os.getenv('POSTGRES_PORT')

    app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{username}:{password}@{url}:{port}/{dbname}'
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)     # 1시간
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)    # 30일

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    app.register_blueprint(auth, url_prefix='/auth')

    return app