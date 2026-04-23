import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import requests as http_requests
from datetime import timedelta

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(BASE_DIR, "medical.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'medicheck-super-secret-key-2026')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

db = SQLAlchemy(app)
jwt = JWTManager(app)

# AI Configuration - OpenAI-compatible API (beeknoee proxy)
AI_API_KEY = os.getenv("OPENAI_API_KEY", "sk-bee-ddafa53cb5a14928bf4754d21a58fb9d")
AI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://platform.beeknoee.com/api/v1")
AI_MODEL = os.getenv("OPENAI_MODEL", "claude-sonnet-4-6")

print(f">>> [AI] Configured. Base URL: {AI_BASE_URL}, Model: {AI_MODEL}")

# ==================== MODELS ====================

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Drug(db.Model):
    __tablename__ = 'drugs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    ingredients = db.Column(db.Text)
    indications = db.Column(db.Text)
    contraindications = db.Column(db.Text)
    dosage = db.Column(db.Text)
    side_effects = db.Column(db.Text)

class Disease(db.Model):
    __tablename__ = 'diseases'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    symptoms = db.Column(db.Text)

class Interaction(db.Model):
    __tablename__ = 'interactions'
    id = db.Column(db.Integer, primary_key=True)
    drug_id = db.Column(db.Integer, db.ForeignKey('drugs.id'), nullable=False)
    target_type = db.Column(db.String(10), nullable=False)
    target_id = db.Column(db.Integer, nullable=False)
    severity = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text)

# ==================== SEED DATA ====================

def seed_data():
    if Drug.query.count() > 0:
        return
    print(">>> Seeding sample data...")

    drugs = [
        Drug(name='Paracetamol', ingredients='Paracetamol',
             indications='Giảm đau, hạ sốt nhẹ đến vừa.',
             contraindications='Mẫn cảm với thành phần thuốc, suy gan nặng.',
             dosage='500-1000mg mỗi 4-6 giờ. Tối đa 4g/ngày.',
             side_effects='Ít tác dụng phụ ở liều điều trị. Có thể gây phát ban.'),
        Drug(name='Ibuprofen', ingredients='Ibuprofen',
             indications='Giảm đau, kháng viêm, hạ sốt.',
             contraindications='Loét dạ dày tá tràng tiến triển, suy thận, hen suyễn.',
             dosage='200-400mg mỗi 4-6 giờ. Uống sau khi ăn.',
             side_effects='Đau bụng, buồn nôn, ợ nóng.'),
        Drug(name='Metformin', ingredients='Metformin Hydrochloride',
             indications='Tiểu đường type 2, đặc biệt ở người thừa cân.',
             contraindications='Suy thận nặng, suy tim, nhiễm toan ceton.',
             dosage='500mg-1000mg/ngày, uống cùng bữa ăn.',
             side_effects='Rối loạn tiêu hóa, chán ăn, vị kim loại trong miệng.'),
        Drug(name='Aspirin', ingredients='Acetylsalicylic acid',
             indications='Giảm đau, kháng viêm, dự phòng huyết khối.',
             contraindications='Loét dạ dày, rối loạn đông máu, trẻ em dưới 16 tuổi.',
             dosage='75-325mg/ngày (dự phòng), 500mg (giảm đau).',
             side_effects='Kích ứng dạ dày, tăng nguy cơ chảy máu.'),
        Drug(name='Amlodipine', ingredients='Amlodipine Besylate',
             indications='Cao huyết áp, đau thắt ngực.',
             contraindications='Huyết áp thấp nghiêm trọng, sốc tim.',
             dosage='5mg-10mg x 1 lần/ngày.',
             side_effects='Sưng cổ chân, nhức đầu, mệt mỏi.'),
        Drug(name='Amoxicillin', ingredients='Amoxicillin',
             indications='Nhiễm khuẩn đường hô hấp, da, tiết niệu.',
             contraindications='Dị ứng với Penicillin.',
             dosage='250mg-500mg mỗi 8 giờ.',
             side_effects='Phát ban, tiêu chảy, buồn nôn.'),
        Drug(name='Atorvastatin', ingredients='Atorvastatin Calcium',
             indications='Giảm cholesterol, phòng ngừa tim mạch.',
             contraindications='Bệnh gan tiến triển, mang thai, cho con bú.',
             dosage='10-80mg/ngày, uống vào buổi tối.',
             side_effects='Đau cơ, tăng men gan, đau đầu.'),
        Drug(name='Omeprazole', ingredients='Omeprazole',
             indications='Loét dạ dày, trào ngược dạ dày thực quản (GERD).',
             contraindications='Mẫn cảm với thuốc ức chế bơm proton.',
             dosage='20-40mg/ngày, uống trước khi ăn 30 phút.',
             side_effects='Đau đầu, tiêu chảy, buồn nôn.'),
    ]
    db.session.add_all(drugs)
    db.session.flush()

    diseases = [
        Disease(name='Sốt xuất huyết',
                description='Bệnh truyền nhiễm cấp tính do virus Dengue lây qua muỗi vằn.',
                symptoms='Sốt cao đột ngột, đau cơ, phát ban, chảy máu cam hoặc nướu.'),
        Disease(name='Tiểu đường type 2',
                description='Rối loạn chuyển hóa mạn tính khiến cơ thể không sử dụng hiệu quả insulin.',
                symptoms='Khát nước thường xuyên, đi tiểu nhiều, mệt mỏi, sụt cân không rõ nguyên nhân.'),
        Disease(name='Viêm dạ dày',
                description='Tình trạng niêm mạc dạ dày bị viêm, có thể do vi khuẩn HP hoặc lối sống.',
                symptoms='Đau vùng thượng vị, ợ chua, đầy bụng, buồn nôn sau khi ăn.'),
        Disease(name='Cao huyết áp',
                description='Tình trạng áp lực máu lên thành động mạch quá cao.',
                symptoms='Thường không có triệu chứng rõ rệt, đôi khi nhức đầu, chóng mặt, đỏ mặt.'),
        Disease(name='Viêm phế quản',
                description='Viêm các ống dẫn khí đến phổi.',
                symptoms='Ho có đờm, khó thở, tức ngực, sốt nhẹ.'),
        Disease(name='Loét dạ dày tá tràng',
                description='Vết loét hình thành trên niêm mạc dạ dày hoặc tá tràng.',
                symptoms='Đau bụng trên rốn, ợ nóng, buồn nôn, đau tăng khi đói.'),
        Disease(name='Tăng cholesterol',
                description='Nồng độ cholesterol xấu (LDL) trong máu cao hơn mức bình thường.',
                symptoms='Thường không có triệu chứng; phát hiện qua xét nghiệm máu.'),
    ]
    db.session.add_all(diseases)
    db.session.flush()

    interactions = [
        Interaction(drug_id=2, target_type='disease', target_id=3, severity='High',
                    description='Ibuprofen (NSAID) làm trầm trọng thêm tình trạng viêm loét và có thể gây xuất huyết dạ dày.'),
        Interaction(drug_id=2, target_type='disease', target_id=6, severity='Severe',
                    description='Ibuprofen chống chỉ định với loét dạ dày tá tràng. Có thể gây thủng hoặc xuất huyết nghiêm trọng.'),
        Interaction(drug_id=4, target_type='drug', target_id=2, severity='High',
                    description='Sử dụng đồng thời Aspirin và Ibuprofen làm tăng đáng kể nguy cơ xuất huyết tiêu hóa.'),
        Interaction(drug_id=1, target_type='drug', target_id=2, severity='Low',
                    description='Có thể phối hợp để tăng hiệu quả giảm đau nhưng cần theo dõi chức năng thận và gan.'),
        Interaction(drug_id=5, target_type='disease', target_id=4, severity='Low',
                    description='Amlodipine là thuốc điều trị chính cho cao huyết áp. Hiệu quả và an toàn khi dùng đúng liều.'),
        Interaction(drug_id=3, target_type='disease', target_id=2, severity='Low',
                    description='Metformin là lựa chọn đầu tay cho tiểu đường type 2. Hiệu quả và ít gây hạ đường huyết.'),
        Interaction(drug_id=7, target_type='disease', target_id=7, severity='Low',
                    description='Atorvastatin là thuốc điều trị tăng cholesterol hiệu quả, giúp giảm nguy cơ tim mạch.'),
        Interaction(drug_id=8, target_type='disease', target_id=3, severity='Low',
                    description='Omeprazole ức chế tiết axit dạ dày, hỗ trợ điều trị viêm và loét dạ dày hiệu quả.'),
        Interaction(drug_id=4, target_type='disease', target_id=6, severity='Severe',
                    description='Aspirin chống chỉ định tuyệt đối với loét dạ dày tá tràng. Có thể gây xuất huyết đe dọa tính mạng.'),
    ]
    db.session.add_all(interactions)

    # Create default admin account
    admin = User(full_name='Quản trị viên', email='admin@medicheck.vn', role='admin')
    admin.set_password('admin123')
    db.session.add(admin)

    db.session.commit()
    print(">>> [SUCCESS] Sample data seeded! Admin: admin@medicheck.vn / admin123")

# Initialize database on startup
with app.app_context():
    db.create_all()
    seed_data()
    print(">>> [SUCCESS] Database ready! (SQLite)")

# ==================== AUTH ROUTES ====================

@app.route('/')
def index():
    return jsonify({"status": "healthy", "message": "MediCheck AI Backend is running"})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not full_name or not email or not password:
        return jsonify({'error': 'Vui lòng điền đầy đủ thông tin'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Mật khẩu phải có ít nhất 6 ký tự'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email này đã được đăng ký'}), 409

    user = User(full_name=full_name, email=email, role='user')
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user': user.to_dict()}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Email hoặc mật khẩu không đúng'}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user': user.to_dict()})

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'Người dùng không tồn tại'}), 404
    return jsonify({'user': user.to_dict()})

# ==================== API ROUTES ====================

@app.route('/api/drugs', methods=['GET'])
def get_drugs():
    search = request.args.get('q', '')
    drugs = Drug.query.filter(Drug.name.ilike(f'%{search}%')).all()
    return jsonify([{
        'id': d.id, 'name': d.name, 'ingredients': d.ingredients,
        'indications': d.indications, 'contraindications': d.contraindications,
        'dosage': d.dosage, 'side_effects': d.side_effects
    } for d in drugs])

@app.route('/api/diseases', methods=['GET'])
def get_diseases():
    search = request.args.get('q', '')
    diseases = Disease.query.filter(Disease.name.ilike(f'%{search}%')).all()
    return jsonify([{
        'id': d.id, 'name': d.name,
        'description': d.description, 'symptoms': d.symptoms
    } for d in diseases])

@app.route('/api/check-interaction', methods=['POST'])
def check_interaction():
    data = request.json
    drug_id = data.get('drug_id')
    target_type = data.get('target_type')
    target_id = data.get('target_id')

    if target_type == 'drug':
        interaction = Interaction.query.filter(
            db.or_(
                db.and_(Interaction.drug_id == drug_id, Interaction.target_id == target_id, Interaction.target_type == 'drug'),
                db.and_(Interaction.drug_id == target_id, Interaction.target_id == drug_id, Interaction.target_type == 'drug')
            )
        ).first()
    else:
        interaction = Interaction.query.filter_by(
            drug_id=drug_id, target_type=target_type, target_id=target_id
        ).first()

    if interaction:
        return jsonify({'found': True, 'severity': interaction.severity, 'description': interaction.description})
    else:
        return jsonify({'found': False, 'message': 'Không tìm thấy tương tác trong cơ sở dữ liệu. Vui lòng dùng AI để phân tích.'})

@app.route('/api/ai-analyze', methods=['POST'])
def ai_analyze():
    data = request.json
    prompt = data.get('prompt')
    system_prompt = "Bạn là một chuyên gia dược học và y tế người Việt Nam. Hãy trả lời câu hỏi sau một cách chuyên nghiệp, chính xác và bằng tiếng Việt. Sử dụng định dạng rõ ràng với các đầu mục."

    try:
        headers = {"Authorization": f"Bearer {AI_API_KEY}", "Content-Type": "application/json"}
        payload = {
            "model": AI_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 2048
        }
        res = http_requests.post(f"{AI_BASE_URL}/chat/completions", json=payload, headers=headers, timeout=60)
        res.raise_for_status()
        result = res.json()
        text = result['choices'][0]['message']['content']
        return jsonify({'response': text})
    except Exception as e:
        print(f">>> [AI ERROR] {str(e)}")
        return jsonify({'error': f'Lỗi AI: {str(e)}'}), 500

# Stats for dashboard
@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'drugs': Drug.query.count(),
        'diseases': Disease.query.count(),
        'interactions': Interaction.query.count(),
        'users': User.query.count()
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
