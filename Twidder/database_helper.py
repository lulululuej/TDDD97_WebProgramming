import sqlite3
from sqlite3 import Error
from flask import g, jsonify
import pathlib
pathlib.Path(__file__).parent.resolve()
DATABASE_URI = pathlib.Path(__file__).parent.resolve().joinpath("database.db")

def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        try:
            db = sqlite3.connect(DATABASE_URI)
            
        except Error as e:
            print(f"The error '{e}' occurred")
    return db

def get_reg_amount():
    db = get_db()
    cursor = db.execute("select count(*) from user")
    count = cursor.fetchone()
    cursor.close()
    if count:
        return  {'success': True, 'data': count[0]}
    else:
        return {'success': False, 'message': "Could not fectch registered user amount"}

def get_user(email):
    db = get_db()
    cursor = db.execute("select * from user where email = (?);", [email])
    match = cursor.fetchall()
    cursor.close()
    if not match:
        return {'success': False, 'message': "No such user."}
    else:
        result = {'email': match[0][0], 'password': match[0][1], 'firstname': match[0][2], 'familyname': match[0][3], 'gender': match[0][4], 'city': match[0][5], 'country': match[0][6], 'token': match[0][7]}
        return {'success': True, 'message': result}

def add_token(email, token):
    db = get_db()
    try:
        db.execute("update user set token = (?) where email = (?);", (token, email))
        db.commit()
        db.close()
        return True
    except Exception as e:
        print(e)
        return False

def delete_token(token):
    db = get_db()
    if token:
        try:
            # see if this token exist or not
            cursor = db.execute("select * from user where token = (?);", [token])
            match = cursor.fetchall()
            if not match:
                return {"success": False, "message": "You are not signed in."}
            else:
            # if token exist then update the token to null
                db.execute("update user set token = null where token = (?);", [token])
                db.commit()
                db.close()
                return {"success": True, "message": "Successfully signed out."}
        except Exception as e:
            print(e)
            return {"success": False, "message": e}
    else:
        return {"success": False, "message": "There is no token input."}

def create_user(email, password, firstname, familyname, gender, city, country):
    try:
        db = get_db()     
        db.execute("insert into user values (?, ?, ?, ?, ?, ?, ?, ?);", (email, password, firstname, familyname, gender, city, country, ''))
        db.commit()
        db.close()
        return True
    except Exception as e:
        print(e)
        return False

def change_password(token, oldpw, newpw):
    db = get_db()
    # see if this token exist or not
    cursor = db.execute("select * from user where token = (?);", [token])
    match = cursor.fetchall()       
    if not match:
        return {"success": False, "message": "You are not logged in."}
    elif (oldpw == match[0][1]):
        try:
            db.execute("update user set password = (?) where token = (?);", (newpw, token))
            db.commit()
            db.close()
            return {"success": True, "message": "Password changed."}
        except Exception as e:
            print(e)
            return {"success": False, "message": e}
    elif (oldpw != match[0][1]):
        return {"success": False, "message": "Wrong password."}

def get_user_data_by_token(token):
    db = get_db()
    # see if this token exist or not
    cursor = db.execute("select email from user where token = (?);", [token])
    email = cursor.fetchone()    
    if not email:
        return {"success": False, "message": "You are not signed in."}
    else:
        return get_user_data_by_email(token, email[0])

def get_user_data_by_email(token, email):
    db = get_db()
    # see if this token exist or not + get user data
    cursor = db.execute("select token from user where token = (?);", [token])
    token = cursor.fetchall()      
    if not token:
        return {"success": False, "message": "You are not signed in."}
    else:
        cursor = db.execute("select * from user where email = (?);", [email])
        match = cursor.fetchall()
        if not match:
            return {"success": False, "message": "No such user."}
            
        result = {'email': match[0][0], 'password': match[0][1], 'firstname': match[0][2], 'familyname': match[0][3], 'gender': match[0][4], 'city': match[0][5], 'country': match[0][6]}
        return {'success': True, "message": "User data retrieved.", "data": result}

def post_messsage(token, message, email, location):
    db = get_db()
    # see if this token exist or not
    cursor = db.execute("select email from user where token = (?);", [token])
    writer = cursor.fetchone()
    print(writer)
    if not writer:
        return {"success": False, "message": "You are not signed in."}
    else:
        cursor = db.execute("select * from user where email = (?);", [email])
        match = cursor.fetchall()
        if not match:
            return {"success": False, "message": "No such user."}
        # insert msg
        db.execute("insert into message (writer, email, content, location) values (?, ?, ?, ?);", (writer[0], email, message, location))
        db.commit()
        db.close()
        return {"success": True, "message": "Message posted"}

def get_user_messages_by_email(token, email):
    db = get_db()
    # see if this token exist or not
    cursor = db.execute("select token from user where token = (?);", [token])
    match = cursor.fetchall()
    if not match:
        return {"success": False, "message": "You are not signed in."}
    else:
        cursor = db.execute("select email from user where email = (?);", [email])
        match = cursor.fetchall()
        if not match:
            return {"success": False, "message": "No such user."}
        cursor = db.execute("select writer, content, location from message where email = (?);", [email])
        message = []
        for msg in cursor:
            message.append({"writer":msg[0], "content": msg[1], "location": msg[2]})
        return {"success": True, "message": "User messages retrieved.", "data": message}

def get_user_messages_by_token(token):
    db = get_db()
    # see if this token exist or not
    cursor = db.execute("select email from user where token = (?);", [token])
    email = cursor.fetchone()
    if not email:
        return {"success": False, "message": "You are not signed in."}
    else:
        return get_user_messages_by_email(token, email[0])

def get_message_count(email):
    db = get_db()
    cursor = db.execute("select count(id) from message where email = (?);", [email])
    count = cursor.fetchone()
    if count:
        return  {'success': True, 'data': count[0]}
    else:
        return {'success': False, 'message': "Could not fectch message amount"}

def disconnect():
    db = getattr(g, 'db', None)
    if db is not None:
        g.db.close()
        g.db = None