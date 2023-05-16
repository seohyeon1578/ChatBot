# Server

train : rasa train
start action server : rasa run actions
start : rasa run --enable-api --cors "*"