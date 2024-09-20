from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Configure SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///food.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Food Model
class Food(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    expiration_date = db.Column(db.DateTime, nullable=False)
    
    

# Route to render the index page (for adding food)
@app.route('/')
def index():
    return render_template('Robinhood-1.0.0/index.html')  # Ensure this file is correctly placed in the templates folder

# API to add food items
@app.route('/api/add-food', methods=['POST'])
def add_food():
    data = request.json

    # Extract and validate data from the request
    name = data.get('name')

    quantity = data.get('quantity')
    location = data.get('location')
    expiration_date = data.get('expiration_date')
    
    if not name:
        return jsonify({"success": False, "error": "Name is required"}), 400
    if not quantity:
        return jsonify({"success": False, "error": "Quantity is required"}), 400
    if not location:
        return jsonify({"success": False, "error": "Location is required"}), 400
    if not expiration_date:
        return jsonify({"success": False, "error": "Expiration Date is required"}), 400


    if int(quantity) <= 0:
        return jsonify({"success": False, "error": "Quantity must be a positive integer"}), 400

    # Parse expiration date
    try:
        expiration_date = datetime.strptime(expiration_date, '%Y-%m-%dT%H:%M')
    except ValueError:
        return jsonify({"success": False, "error": "Invalid date format"}), 400

    try:
        # Create and store a new food item
        new_food = Food(name=name, quantity=quantity, location=location, expiration_date=expiration_date)
        db.session.add(new_food)
        db.session.commit()

        return jsonify({"success": True, "message": "Food item added successfully!"}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/restaurant/viewfood')
def view_food_items():
    food_items = Food.query.all()
    return render_template('restaurant/index.html', food_items=food_items)



@app.route('/user/cleanup-expired-food', methods=['DELETE'])
def cleanup_expired_food():
    today = datetime.now()
    expired_items = Food.query.filter(Food.expiration_date <= today).all()

    if expired_items:
        for item in expired_items:
            db.session.delete(item)
        db.session.commit()
        return jsonify({"success": True, "message": f"Deleted {len(expired_items)} expired food items."}), 200
    else:
        return jsonify({"success": False, "message": "No expired food items found."}), 200






# Initialize the database
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure tables are created
    app.run(debug=True)
