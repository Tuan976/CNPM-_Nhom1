import os
import sqlite3
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'medicheck-super-secret-key-2026'
jwt = JWTManager(app)

DB_PATH = 'medical_v2.db'

# --- DATABASE SETUP ---
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    # Users table with specific roles
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT DEFAULT 'doctor' -- doctor, pharmacist, admin
    )''')
    
    # Drugs table with generic name and pharmacological group
    conn.execute('''CREATE TABLE IF NOT EXISTS drugs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, -- Brand Name
        ingredients TEXT NOT NULL, -- Generic Name / Active Ingredients
        indications TEXT,
        contraindications TEXT,
        side_effects TEXT,
        dosage TEXT,
        pharmacological_group TEXT -- For suggesting alternatives
    )''')
    
    # Diseases table with ICD-10 code
    conn.execute('''CREATE TABLE IF NOT EXISTS diseases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icd10 TEXT, -- International Classification of Diseases
        description TEXT,
        symptoms TEXT
    )''')
    
    # Interactions table
    conn.execute('''CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        drug_id INTEGER,
        target_type TEXT, -- 'drug' or 'disease'
        target_id INTEGER,
        severity TEXT, -- Severe, High, Moderate, Low
        description TEXT,
        FOREIGN KEY (drug_id) REFERENCES drugs(id)
    )''')
    
    conn.commit()
    seed_data(conn)
    conn.close()

def seed_data(conn):
    # Check if data exists
    if conn.execute('SELECT count(*) FROM drugs').fetchone()[0] > 0:
        return

    # Seed Admin
    admin_pw = generate_password_hash('admin123')
    conn.execute('INSERT OR IGNORE INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
                 ('admin@medicheck.vn', admin_pw, 'Quản trị viên', 'admin'))
    
    # Seed Drugs with Pharmacological Groups
    drugs_data = [
        ('Paracetamol 500mg', 'Paracetamol', 'Giảm đau, hạ sốt', 'Suy gan nặng', 'Vàng da, phát ban', '1 viên mỗi 4-6h', 'Giảm đau hạ sốt'),
        ('Ibuprofen 400mg', 'Ibuprofen', 'Kháng viêm, giảm đau', 'Loét dạ dày, suy thận', 'Đau bụng, buồn nôn', '1 viên sau ăn', 'NSAIDs'),
        ('Aspirin 81mg', 'Acetylsalicylic acid', 'Phòng ngừa huyết khối', 'Rối loạn đông máu', 'Chảy máu tiêu hóa', '1 viên/ngày', 'NSAIDs'),
        ('Amoxicillin 500mg', 'Amoxicillin', 'Nhiễm khuẩn hô hấp', 'Dị ứng Penicillin', 'Tiêu chảy, dị ứng', '1 viên x 3 lần/ngày', 'Kháng sinh Penicillin'),
        ('Metformin 850mg', 'Metformin', 'Tiểu đường type 2', 'Suy thận, nhiễm toan', 'Đầy hơi, tiêu chảy', '1 viên x 2 lần/ngày', 'Biguanides')
    ]
    conn.executemany('INSERT INTO drugs (name, ingredients, indications, contraindications, side_effects, dosage, pharmacological_group) VALUES (?,?,?,?,?,?,?)', drugs_data)

    # Seed Diseases with ICD-10
    diseases_data = [
        ('Viêm loét dạ dày', 'K25', 'Tổn thương niêm mạc dạ dày', 'Đau thượng vị, ợ chua'),
        ('Suy thận mãn tính', 'N18', 'Thận mất chức năng lọc', 'Mệt mỏi, phù nề'),
        ('Tiểu đường type 2', 'E11', 'Tăng đường huyết mãn tính', 'Khát nước, tiểu nhiều'),
        ('Tăng huyết áp', 'I10', 'Áp lực máu động mạch cao', 'Đau đầu, chóng mặt')
    ]
    conn.executemany('INSERT INTO diseases (name, icd10, description, symptoms) VALUES (?,?,?,?)', diseases_data)

    # Seed Interactions
    interactions_data = [
        (2, 'disease', 1, 'Severe', 'Ibuprofen gây kích ứng và làm trầm trọng thêm vết loét dạ dày.'),
        (2, 'drug', 3, 'High', 'Kết hợp NSAIDs làm tăng nguy cơ xuất huyết tiêu hóa.'),
        (5, 'disease', 2, 'Severe', 'Metformin chống chỉ định tuyệt đối cho bệnh nhân suy thận nặng.')
    ]
    conn.executemany('INSERT INTO interactions (drug_id, target_type, target_id, severity, description) VALUES (?,?,?,?,?)', interactions_data)
    conn.commit()

# --- AI INTEGRATION ---
def call_ai(prompt):
    api_key = os.getenv('OPENAI_API_KEY', 'sk-bee-ddafa53cb5a14928bf4754d21a58fb9d')
    base_url = os.getenv('OPENAI_BASE_URL', 'https://platform.beeknoee.com/api/v1')
    model = os.getenv('OPENAI_MODEL', 'claude-sonnet-4-6')
    
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3
    }
    try:
        res = requests.post(f"{base_url}/chat/completions", headers=headers, json=payload)
        return res.json()['choices'][0]['message']['content']
    except Exception as e:
        return f"AI Error: {str(e)}"

# --- ROUTES ---
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    pw_hash = generate_password_hash(data['password'])
    role = data.get('role', 'doctor') # doctor, pharmacist
    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
                     (data['email'], pw_hash, data['full_name'], role))
        conn.commit()
        # Return user info (no token here to keep it simple, or generate one)
        user = conn.execute('SELECT id, email, full_name, role FROM users WHERE email = ?', (data['email'],)).fetchone()
        token = create_access_token(identity=str(user['id']))
        return jsonify({'token': token, 'user': dict(user)}), 201
    except:
        return jsonify({'error': 'Email đã tồn tại'}), 400
    finally:
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (data['email'],)).fetchone()
    conn.close()
    if user and check_password_hash(user['password'], data['password']):
        token = create_access_token(identity=str(user['id']))
        return jsonify({'token': token, 'user': {'id': user['id'], 'email': user['email'], 'full_name': user['full_name'], 'role': user['role']}})
    return jsonify({'error': 'Sai email hoặc mật khẩu'}), 401

@app.route('/api/drugs', methods=['GET', 'POST'])
def handle_drugs():
    conn = get_db_connection()
    if request.method == 'GET':
        q = request.args.get('q', '')
        # Diverse search: Name OR Ingredients
        drugs = conn.execute("SELECT * FROM drugs WHERE name LIKE ? OR ingredients LIKE ?", (f'%{q}%', f'%{q}%')).fetchall()
        return jsonify([dict(d) for d in drugs])
    
    # Admin CRUD: Create
    data = request.json
    conn.execute('INSERT INTO drugs (name, ingredients, indications, contraindications, side_effects, dosage, pharmacological_group) VALUES (?,?,?,?,?,?,?)',
                 (data['name'], data['ingredients'], data.get('indications'), data.get('contraindications'), data.get('side_effects'), data.get('dosage'), data.get('pharmacological_group')))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Thành công'}), 201

@app.route('/api/drugs/<int:id>', methods=['PUT', 'DELETE'])
def crud_drug(id):
    conn = get_db_connection()
    if request.method == 'DELETE':
        conn.execute('DELETE FROM drugs WHERE id = ?', (id,))
        conn.commit()
        return jsonify({'message': 'Đã xóa'})
    
    data = request.json
    conn.execute('UPDATE drugs SET name=?, ingredients=?, indications=?, contraindications=?, side_effects=?, dosage=?, pharmacological_group=? WHERE id=?',
                 (data['name'], data['ingredients'], data.get('indications'), data.get('contraindications'), data.get('side_effects'), data.get('dosage'), data.get('pharmacological_group'), id))
    conn.commit()
    return jsonify({'message': 'Đã cập nhật'})

@app.route('/api/diseases', methods=['GET', 'POST'])
def handle_diseases():
    conn = get_db_connection()
    if request.method == 'GET':
        q = request.args.get('q', '')
        # Diverse search: Name OR ICD-10
        diseases = conn.execute("SELECT * FROM diseases WHERE name LIKE ? OR icd10 LIKE ?", (f'%{q}%', f'%{q}%')).fetchall()
        return jsonify([dict(d) for d in diseases])
    
    data = request.json
    conn.execute('INSERT INTO diseases (name, icd10, description, symptoms) VALUES (?,?,?,?)',
                 (data['name'], data['icd10'], data.get('description'), data.get('symptoms')))
    conn.commit()
    return jsonify({'message': 'Thành công'}), 201

@app.route('/api/check-interaction', methods=['POST'])
def check_interaction():
    data = request.json
    conn = get_db_connection()
    inter = conn.execute('SELECT * FROM interactions WHERE drug_id = ? AND target_type = ? AND target_id = ?',
                        (data['drug_id'], data['target_type'], data['target_id'])).fetchone()
    
    result = {'found': False}
    if inter:
        result = {'found': True, 'severity': inter['severity'], 'description': inter['description']}
    
    # NEW: Suggest alternatives if interaction is found
    alternatives = []
    if result['found'] and result['severity'] in ['Severe', 'High']:
        current_drug = conn.execute('SELECT pharmacological_group FROM drugs WHERE id = ?', (data['drug_id'],)).fetchone()
        if current_drug and current_drug['pharmacological_group']:
            # Find drugs in same group that DON'T have a recorded interaction with this target
            alts = conn.execute('''
                SELECT * FROM drugs 
                WHERE pharmacological_group = ? AND id != ?
                AND id NOT IN (SELECT drug_id FROM interactions WHERE target_type = ? AND target_id = ?)
            ''', (current_drug['pharmacological_group'], data['drug_id'], data['target_type'], data['target_id'])).fetchall()
            alternatives = [dict(a) for a in alts]
            
    conn.close()
    return jsonify({**result, 'alternatives': alternatives})

@app.route('/api/ai-analyze', methods=['POST'])
def ai_analyze():
    data = request.json
    response = call_ai(data['prompt'])
    return jsonify({'response': response})

@app.route('/api/stats')
def get_stats():
    conn = get_db_connection()
    counts = {
        'drugs': conn.execute('SELECT count(*) FROM drugs').fetchone()[0],
        'diseases': conn.execute('SELECT count(*) FROM diseases').fetchone()[0],
        'interactions': conn.execute('SELECT count(*) FROM interactions').fetchone()[0],
        'users': conn.execute('SELECT count(*) FROM users').fetchone()[0],
    }
    conn.close()
    return jsonify(counts)

if __name__ == '__main__':
    if not os.path.exists(DB_PATH):
        init_db()
    else:
        # Update schema if column missing (safe migration for local)
        conn = get_db_connection()
        try: conn.execute('SELECT icd10 FROM diseases LIMIT 1')
        except: 
            conn.execute('ALTER TABLE diseases ADD COLUMN icd10 TEXT')
            conn.execute('ALTER TABLE drugs ADD COLUMN pharmacological_group TEXT')
        conn.commit()
        conn.close()
    app.run(debug=True, port=5000)
