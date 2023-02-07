from flask import Flask, render_template, request, jsonify
import database_helper
import math
import random 

app = Flask(__name__)

@app.route("/", methods = ['GET'])
def root():
    return 'Hello World!', 200

@app.route("/sign_in/", methods = ['GET', 'POST'])
def sign_in():
    param = request.get_json()
    res = database_helper.get_user(param['email'])
    if(res['success']):
        data = res['message']
        if(param['email'] == data['email'] and param['password'] == data['password']):
            letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
            token = ""
            for i in range(0, 36):
                token += letters[math.floor(random.random() * len(letters))]
            
            database_helper.add_token(param['email'], token)
            return {"success": True, "message": "Successfully signed in.", "data": token}, 201
            
        else:
            return {"success": False, "message": "Wrong username or password."}, 403
    else:
        print(res['message'])
        return res, 403


@app.route("/sign_up/", methods = ['POST'])
def sign_up():
    data = request.get_json()
    if(data['email'] and data['password'] and data['firstname'] and data['familyname'] and data['gender'] and data['city'] and data['country']):
        res = database_helper.create_user(data['email'], data['password'], data['firstname'], data['familyname'], data['gender'], data['city'], data['country'])
        if res:
            return {"success": True, "message": "Successfully created a new user."}, 201
        else:
            return {"success": False, "message": "User already exists."}, 409
    else:
        return {"success": False, "message": "Form data missing or incorrect type."}, 400
    

@app.route("/sign_out/", methods = ['PATCH'])
def sign_out():
    token = request.headers.get('Authorization')
    res = database_helper.delete_token(token)
    if res['success']:
        return res, 204
    else:
        return res, 401

@app.route("/change_password/")
def change_password():
    data = request.get_json()
    token = request.headers.get('Authorization')
    res = database_helper.change_password(token, data['oldpw'], data['newpw'])
    if res['success']:
        return res, 201
    else:
        return res, 401

@app.route("/get_user_data_by_token/", methods = ['GET'])
def get_user_data_by_token():
    token = request.headers.get('Authorization')
    res = database_helper.get_user_data_by_token(token)

    if res["success"]:
        return res, 200
    else:
        return res, 401

@app.route("/get_user_data_by_email/", methods = ['GET'])
def get_user_data_by_email():
    data = request.get_json()
    token = request.headers.get('Authorization')
    res = database_helper.get_user_data_by_email(token, data['email'])

    if res["success"]:
        return res, 200
    else:
        return res, 401


@app.route("/get_user_messages_by_token/", methods = ['GET'])
def get_user_messages_by_token():
    token = request.headers.get('Authorization')
    res = database_helper.get_user_messages_by_token(token)

    if res["success"]:
        return res, 200
    else:
        return res, 401


@app.route("/get_user_messages_by_email/", methods = ['GET'])
def get_user_messages_by_email():
    data = request.get_json()
    token = request.headers.get('Authorization')
    res = database_helper.get_user_messages_by_email(token, data['email'])

    if res["success"]:
        return res, 200
    else:
        return res, 401

@app.route("/post_message/", methods = ['POST'])
def post_message():
    data = request.get_json()
    token = request.headers.get('Authorization')
    res = database_helper.post_messsage(token, data['message'], data['email'])

    if res['success']:
        return res, 201
    else:
        return res, 401 

if __name__ == '__main__':
    app.run()

