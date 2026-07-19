-- Site content table for CMS
CREATE TABLE IF NOT EXISTS site_content (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  content_type ENUM('text','textarea','email','phone','url','json') DEFAULT 'text',
  label VARCHAR(150) NOT NULL,
  value LONGTEXT,
  sort_order SMALLINT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_page_key (page, section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
