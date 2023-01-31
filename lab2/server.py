from flask import Flask, render_template

app = Flask(__name__)

@app.route("/sign_in")
def sign_in(email, password):

    return 

@app.route("/sign_up")
def sign_up(email, password, firstname, familyname, gender, city, country):
    if( not email or  not password or not firstname or not familyname or not gender or not city or not country):
        return "The emtpy input provided could not be handled.", 400
    if( len(password) < 8):
        return "The password input provided is too short.", 400
    

@app.route("/sign_out")
def sign_out():

    return 

@app.route("/change_password")
def change_password():

    return 

@app.route("/get_user_data_by_token")
def get_user_data_by_token():

    return 

@app.route("/get_user_data_by_email")
def get_user_data_by_email():

    return 

@app.route("/get_user_messages_by_token")
def get_user_messages_by_token():

    return 

@app.route("/get_user_messages_by_email")
def get_user_messages_by_email():

    return 

@app.route("/post_message")
def post_message():

    return 

if __name__ == '__main__':
    app.run()

