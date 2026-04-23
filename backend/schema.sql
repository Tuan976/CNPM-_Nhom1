CREATE DATABASE IF NOT EXISTS medical_db;
USE medical_db;

CREATE TABLE IF NOT EXISTS drugs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients TEXT,
    indications TEXT,
    contraindications TEXT,
    dosage TEXT,
    side_effects TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    symptoms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drug_id INT NOT NULL,
    target_type ENUM('drug', 'disease') NOT NULL,
    target_id INT NOT NULL,
    severity ENUM('Low', 'Moderate', 'High', 'Severe') NOT NULL,
    description TEXT,
    FOREIGN KEY (drug_id) REFERENCES drugs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO drugs (name, ingredients, indications, contraindications, dosage, side_effects) VALUES
('Paracetamol', 'Paracetamol', 'Giảm đau, hạ sốt nhẹ đến vừa.', 'Mẫn cảm với thành phần thuốc, suy gan nặng.', '500-1000mg mỗi 4-6 giờ. Tối đa 4g/ngày.', 'Ít tác dụng phụ ở liều điều trị. Có thể gây phát ban.'),
('Ibuprofen', 'Ibuprofen', 'Giảm đau, kháng viêm, hạ sốt.', 'Loét dạ dày tá tràng tiến triển, suy thận, hen suyễn.', '200-400mg mỗi 4-6 giờ. Uống sau khi ăn.', 'Đau bụng, buồn nôn, ợ nóng.'),
('Metformin', 'Metformin Hydrochloride', 'Tiểu đường type 2, đặc biệt ở người thừa cân.', 'Suy thận nặng, suy tim, nhiễm toan ceton.', '500mg-1000mg/ngày, uống cùng bữa ăn.', 'Rối loạn tiêu hóa, chán ăn, vị kim loại trong miệng.'),
('Aspirin', 'Acetylsalicylic acid', 'Giảm đau, kháng viêm, dự phòng huyết khối.', 'Loét dạ dày, rối loạn đông máu, trẻ em dưới 16 tuổi.', '75-325mg/ngày (dự phòng), 500mg (giảm đau).', 'Kích ứng dạ dày, tăng nguy cơ chảy máu.'),
('Amlodipine', 'Amlodipine Besylate', 'Cao huyết áp, đau thắt ngực.', 'Huyết áp thấp nghiêm trọng, sốc tim.', '5mg-10mg x 1 lần/ngày.', 'Sưng cổ chân, nhức đầu, mệt mỏi.'),
('Amoxicillin', 'Amoxicillin', 'Nhiễm khuẩn đường hô hấp, da, tiết niệu.', 'Dị ứng với Penicillin.', '250mg-500mg mỗi 8 giờ.', 'Phát ban, tiêu chảy, buồn nôn.');

INSERT INTO diseases (name, description, symptoms) VALUES
('Sốt xuất huyết', 'Bệnh truyền nhiễm cấp tính do virus Dengue lây qua muỗi vằn.', 'Sốt cao đột ngột, đau cơ, phát ban, chảy máu cam hoặc nướu.'),
('Tiểu đường type 2', 'Rối loạn chuyển hóa mạn tính khiến cơ thể không sử dụng hiệu quả insulin.', 'Khát nước thường xuyên, đi tiểu nhiều, mệt mỏi, sụt cân không rõ nguyên nhân.'),
('Viêm dạ dày', 'Tình trạng niêm mạc dạ dày bị viêm, có thể do vi khuẩn HP hoặc lối sống.', 'Đau vùng thượng vị, ợ chua, đầy bụng, buồn nôn sau khi ăn.'),
('Cao huyết áp', 'Tình trạng áp lực máu lên thành động mạch quá cao.', 'Thường không có triệu chứng rõ rệt, đôi khi nhức đầu, chóng mặt, đỏ mặt.'),
('Viêm phế quản', 'Viêm các ống dẫn khí đến phổi.', 'Ho có đờm, khó thở, tức ngực, sốt nhẹ.');

INSERT INTO interactions (drug_id, target_type, target_id, severity, description) VALUES
(2, 'disease', 3, 'High', 'Ibuprofen là thuốc kháng viêm không steroid (NSAID), có thể làm trầm trọng thêm tình trạng viêm loét và gây chảy máu dạ dày.'),
(4, 'drug', 2, 'High', 'Sử dụng đồng thời Aspirin và Ibuprofen làm tăng đáng kể nguy cơ xuất huyết tiêu hóa.'),
(1, 'drug', 2, 'Low', 'Có thể phối hợp để tăng hiệu quả giảm đau nhưng cần theo dõi chức năng thận.'),
(5, 'disease', 4, 'High', 'Amlodipine là thuốc điều trị chính cho cao huyết áp, cần tuân thủ liều lượng để tránh hạ huyết áp quá mức.'),
(3, 'disease', 2, 'High', 'Metformin là thuốc đầu tay cho tiểu đường type 2, giúp kiểm soát đường huyết hiệu quả.');
