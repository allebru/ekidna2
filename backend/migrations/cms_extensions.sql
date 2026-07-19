-- Estensione CMS: campo "image" per i contenuti (upload) + tabella meta SEO per pagina.

ALTER TABLE site_content
  MODIFY content_type ENUM('text','textarea','email','phone','url','json','image') DEFAULT 'text';

CREATE TABLE IF NOT EXISTS page_seo (
  page VARCHAR(50) NOT NULL PRIMARY KEY,
  meta_title VARCHAR(70) NOT NULL,
  meta_description VARCHAR(160) NOT NULL,
  og_image VARCHAR(255) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
