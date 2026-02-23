'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';

/**
 * お問い合わせフォーム
 *
 * Phase 2 では UI のみ実装。送信先 API は Phase 3 で追加する。
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }

      setStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="section-container">
        <div className="section-label">Contact</div>
        <h2 className="section-title">
          組織の次の形態へ
          <br />
          <span className="gradient-text-glow">今すぐ始める</span>
        </h2>
        <p className="section-desc" style={{ marginBottom: 'var(--space-9)' }}>
          Neural Organization の導入についてご相談ください。
          あなたの組織に最適な変容プロセスを設計します。
        </p>

        <div className={styles.container}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                  お名前 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="山田 太郎"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  メールアドレス <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="example@company.com"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="company" className={styles.label}>
                会社名
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={styles.input}
                placeholder="株式会社サンプル"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>
                メッセージ <span className={styles.required}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={styles.textarea}
                placeholder="Neural Organization についてお聞きになりたいこと、導入検討の背景などをお聞かせください。"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className={`btn btn-primary btn-lg ${styles.submitButton}`}
            >
              {status === 'submitting' ? '送信中...' : status === 'success' ? '送信完了！' : 'お問い合わせを送信'}
            </button>

            {status === 'error' && (
              <div className={styles.errorMessage}>
                送信に失敗しました。しばらく時間をおいて再度お試しください。
              </div>
            )}
          </form>

          <div className={styles.info}>
            <div className={styles.infoCard}>
              <h4 className={styles.infoTitle}>導入プロセス</h4>
              <ul className={styles.infoList}>
                <li>1. 初回相談（30分）</li>
                <li>2. 組織診断とフィット評価</li>
                <li>3. 変容プロセス設計</li>
                <li>4. Phase 1 導入開始</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h4 className={styles.infoTitle}>対象企業</h4>
              <ul className={styles.infoList}>
                <li>成長期 SaaS 企業</li>
                <li>従業員 20-100名</li>
                <li>ARR ¥1-10B</li>
                <li>YoY 成長率 50%+</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
