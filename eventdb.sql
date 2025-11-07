DROP DATABASE IF EXISTS eventdb;
CREATE DATABASE eventdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventdb;

-- ======================================================
-- BẢNG CHA: Account
-- ======================================================
CREATE TABLE Account (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Khóa chính định danh tài khoản',
    password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu (được mã hóa)',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email người dùng (duy nhất)',
    name VARCHAR(100) COMMENT 'Họ và tên người dùng',
    avatar VARCHAR(255) COMMENT 'Đường dẫn ảnh đại diện (S3 URL)',
    role ENUM('ADMIN', 'USER') DEFAULT 'USER' COMMENT 'Vai trò tài khoản (ADMIN hoặc USER)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo tài khoản',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái hoạt động (TRUE = kích hoạt, FALSE = vô hiệu hóa)'
) COMMENT='Bảng tài khoản gốc, được kế thừa bởi Admin và User';

INSERT INTO Account (password, email, name, role) VALUES
('123456', 'admin@aicloud.com', 'Administrator', 'ADMIN'),
('123456', 'trung@gmail.com', 'Lư Hiếu Trung', 'USER'),
('123456', 'chuong@gmail.com', 'Trương Nguyên Chương', 'USER'),
('123456', 'duong@gmail.com', 'Nguyễn Hải Dương', 'USER');

-- ======================================================
-- ADMIN kế thừa từ Account
-- ======================================================
CREATE TABLE Admin (
    id INT PRIMARY KEY COMMENT 'Khóa chính, đồng thời là khóa ngoại từ Account',
    department VARCHAR(100) COMMENT 'Phòng ban phụ trách của admin',
    FOREIGN KEY (id) REFERENCES Account(id)
) COMMENT='Thông tin mở rộng cho tài khoản admin';

INSERT INTO Admin (id, department) VALUES
(1, 'System Management');

-- ======================================================
-- USER kế thừa từ Account
-- ======================================================
CREATE TABLE User (
    id INT PRIMARY KEY COMMENT 'Khóa chính, đồng thời là khóa ngoại từ Account',
    city VARCHAR(100) COMMENT 'Thành phố người dùng',
    interests TEXT COMMENT 'Sở thích hoặc lĩnh vực quan tâm',
    sentiment_score FLOAT DEFAULT 0 COMMENT 'Điểm cảm xúc tổng hợp qua phản hồi và chatbot',
    FOREIGN KEY (id) REFERENCES Account(id)
) COMMENT='Thông tin mở rộng cho người dùng thường';

INSERT INTO User (id, city, interests) VALUES
(2, 'Hà Nội', 'AI, công nghệ, workshop'),
(3, 'TP. Hồ Chí Minh', 'Âm nhạc, du lịch, networking'),
(4, 'Đà Nẵng', 'Khởi nghiệp, đổi mới sáng tạo');

-- ======================================================
-- BẢNG SỰ KIỆN
-- ======================================================
CREATE TABLE Event (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Khóa chính sự kiện',
    title VARCHAR(255) COMMENT 'Tên hoặc tiêu đề sự kiện',
    description TEXT COMMENT 'Mô tả chi tiết về nội dung sự kiện',
    location VARCHAR(255) COMMENT 'Địa điểm cụ thể diễn ra sự kiện',
    city VARCHAR(100) COMMENT 'Thành phố tổ chức sự kiện',
    category VARCHAR(100) COMMENT 'Phân loại sự kiện (Công nghệ, Giải trí, v.v.)',
    start_time DATETIME COMMENT 'Thời gian bắt đầu sự kiện',
    end_time DATETIME COMMENT 'Thời gian kết thúc sự kiện',
    created_by INT COMMENT 'Người tạo sự kiện (Account ID)',
    image_url VARCHAR(255) COMMENT 'Hình ảnh minh họa (lưu S3 URL)',
    tags VARCHAR(255) COMMENT 'Từ khóa mô tả sự kiện (phục vụ tìm kiếm/RAG)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING' COMMENT 'Trạng thái duyệt: PENDING - chờ duyệt, ACCEPTED - đã duyệt, REJECTED - bị từ chối',
    accepted_by INT NULL COMMENT 'ID admin đã duyệt sự kiện (nếu có)',
    FOREIGN KEY (created_by) REFERENCES Account(id),
    FOREIGN KEY (accepted_by) REFERENCES Admin(id)
) COMMENT='Thông tin chi tiết các sự kiện trong hệ thống';

INSERT INTO Event (title, description, location, city, category, start_time, end_time, created_by, image_url, tags) VALUES
('AI Meetup 2025', 'Hội thảo chia sẻ xu hướng AI tại Việt Nam', 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Công nghệ', '2025-12-01 09:00:00', '2025-12-01 17:00:00', 1, 'https://s3.amazonaws.com/aievent/ai_meetup.jpg', 'AI, Tech'),
('Workshop ReactJS', 'Buổi chia sẻ về ReactJS hiện đại', 'Hà Nội', 'Hà Nội', 'Lập trình', '2025-11-20 13:00:00', '2025-11-20 17:00:00', 2, 'https://s3.amazonaws.com/aievent/react_workshop.jpg', 'Frontend, Web'),
('Music Festival', 'Sự kiện âm nhạc ngoài trời cuối năm', 'Đà Nẵng', 'Đà Nẵng', 'Giải trí', '2025-12-15 18:00:00', '2025-12-15 23:00:00', 3, 'https://s3.amazonaws.com/aievent/musicfest.jpg', 'Music, Festival');

-- ======================================================
-- FEEDBACK (phân tích cảm xúc qua AWS Comprehend)
-- ======================================================
CREATE TABLE EventFeedback (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Khóa chính phản hồi',
    event_id INT COMMENT 'ID sự kiện được phản hồi',
    user_id INT COMMENT 'Người gửi phản hồi (User ID)',
    rating INT COMMENT 'Điểm đánh giá (1–5)',
    comment TEXT COMMENT 'Nội dung phản hồi của người dùng',
    sentiment ENUM('POSITIVE','NEUTRAL','NEGATIVE') COMMENT 'Cảm xúc phân tích bằng AWS Comprehend',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm gửi phản hồi',
    FOREIGN KEY (event_id) REFERENCES Event(id),
    FOREIGN KEY (user_id) REFERENCES User(id)
) COMMENT='Phản hồi người dùng về sự kiện, kèm phân tích cảm xúc';

INSERT INTO EventFeedback (event_id, user_id, rating, comment, sentiment) VALUES
(1, 2, 5, 'Sự kiện rất bổ ích và tổ chức tốt!', 'POSITIVE'),
(2, 3, 4, 'Nội dung khá hay nhưng hơi dài', 'NEUTRAL'),
(3, 4, 5, 'Không khí tuyệt vời!', 'POSITIVE');

-- ======================================================
-- CHATBOT HISTORY (phục vụ RAG)
-- ======================================================
CREATE TABLE ChatHistory (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Khóa chính lịch sử trò chuyện',
    user_id INT COMMENT 'Người dùng gửi tin nhắn',
    message TEXT COMMENT 'Tin nhắn người dùng gửi',
    ai_response TEXT COMMENT 'Phản hồi của chatbot (AI)',
    context_used TEXT COMMENT 'Ngữ cảnh đã được sử dụng trong truy xuất RAG',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tương tác',
    FOREIGN KEY (user_id) REFERENCES User(id)
) COMMENT='Lưu lịch sử trò chuyện giữa người dùng và AI';

INSERT INTO ChatHistory (user_id, message, ai_response, context_used) VALUES
(2, 'Tuần này có sự kiện AI nào không?', 'Có, AI Meetup 2025 tại TP.HCM ngày 1/12.', 'Event: AI Meetup 2025'),
(3, 'Có workshop ReactJS nào không?', 'Có workshop ReactJS ở Hà Nội vào 20/11.', 'Event: Workshop ReactJS');

-- ======================================================
-- RECOMMENDATION (gợi ý từ AWS SageMaker)
-- ======================================================
CREATE TABLE Recommendation (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Khóa chính gợi ý',
    user_id INT COMMENT 'Người dùng được đề xuất',
    event_id INT COMMENT 'Sự kiện được gợi ý',
    model_used VARCHAR(100) COMMENT 'Tên mô hình AI trên SageMaker sử dụng',
    score FLOAT COMMENT 'Độ tin cậy của gợi ý (0–1)',
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo gợi ý',
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (event_id) REFERENCES Event(id)
) COMMENT='Gợi ý sự kiện cho người dùng, sinh ra từ SageMaker';

INSERT INTO Recommendation (user_id, event_id, model_used, score) VALUES
(2, 1, 'SageMaker-EventRec-v1', 0.93),
(3, 2, 'SageMaker-EventRec-v1', 0.87),
(4, 3, 'SageMaker-EventRec-v1', 0.95);

-- ======================================================
-- EVENT EMBEDDINGS (phục vụ RAG - lưu metadata vector)
-- ======================================================
CREATE TABLE EventEmbedding (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Khóa chính embedding sự kiện',
    event_id INT COMMENT 'Sự kiện tương ứng với vector',
    vector_data TEXT COMMENT 'Mảng vector embedding (dạng JSON)',
    source_text TEXT COMMENT 'Nội dung gốc được mã hóa thành vector',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
    FOREIGN KEY (event_id) REFERENCES Event(id)
) COMMENT='Lưu vector embedding và metadata cho RAG truy vấn sự kiện';

INSERT INTO EventEmbedding (event_id, vector_data, source_text) VALUES
(1, '[0.12, 0.33, 0.85, 0.27]', 'AI Meetup 2025 - Hội thảo chia sẻ xu hướng AI'),
(2, '[0.18, 0.44, 0.73, 0.25]', 'Workshop ReactJS - buổi chia sẻ ReactJS hiện đại'),
(3, '[0.52, 0.14, 0.68, 0.33]', 'Music Festival - sự kiện âm nhạc cuối năm');

-- ======================================================
-- IMAGE ANALYSIS (AWS Rekognition)
-- ======================================================
CREATE TABLE ImageAnalysis (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Khóa chính phân tích ảnh',
    event_id INT COMMENT 'Sự kiện liên kết ảnh',
    s3_url VARCHAR(255) COMMENT 'Đường dẫn ảnh lưu trữ trên S3',
    labels TEXT COMMENT 'Nhãn đối tượng được nhận diện bởi Rekognition',
    confidence FLOAT COMMENT 'Độ tin cậy trung bình của nhãn',
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm phân tích ảnh',
    FOREIGN KEY (event_id) REFERENCES Event(id)
) COMMENT='Kết quả phân tích hình ảnh sự kiện bằng AWS Rekognition';

INSERT INTO ImageAnalysis (event_id, s3_url, labels, confidence) VALUES
(1, 'https://s3.amazonaws.com/aievent/ai_meetup.jpg', 'Conference, People, AI', 0.94),
(2, 'https://s3.amazonaws.com/aievent/react_workshop.jpg', 'Laptop, People, Code', 0.91),
(3, 'https://s3.amazonaws.com/aievent/musicfest.jpg', 'Stage, Concert, Crowd', 0.97);

-- ======================================================
-- SYSTEM LOG (theo dõi hoạt động hệ thống)
-- ======================================================
CREATE TABLE SystemLog (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Khóa chính bản ghi log',
    level ENUM('INFO','WARN','ERROR') COMMENT 'Mức độ log (thông tin, cảnh báo, lỗi)',
    message TEXT COMMENT 'Nội dung log',
    service VARCHAR(100) COMMENT 'Dịch vụ hoặc module phát sinh log',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm ghi log'
) COMMENT='Nhật ký hoạt động của hệ thống (backend, lambda, v.v.)';

INSERT INTO SystemLog (level, message, service) VALUES
('INFO', 'Embedding sync completed for event_id=1', 'Lambda-RAGSync'),
('INFO', 'New recommendation generated for user_id=2', 'SageMaker'),
('ERROR', 'Bedrock API timeout', 'Backend-API');
