'use client';

import { useState, useEffect } from 'react';
import styles from './HeroBanner.module.css';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: 'Discover Amazing Products',
    subtitle: 'Shop the latest trends with AI-powered recommendations',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    ctaText: 'Shop Now',
    ctaLink: '#products'
  },
  {
    id: 2,
    title: 'Premium Quality',
    subtitle: 'Handpicked items from trusted brands worldwide',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
    ctaText: 'Explore',
    ctaLink: '#products'
  },
  {
    id: 3,
    title: 'AI Shopping Assistant',
    subtitle: 'Get personalized recommendations powered by AI',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    ctaText: 'Try AI Assistant',
    ctaLink: '#chat'
  }
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className={styles.heroBanner}>
      <div className={styles.bannerContainer}>
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.bannerSlide} ${
              index === currentSlide ? styles.bannerSlideActive : ''
            }`}
          >
            <div 
              className={styles.bannerImage}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className={styles.bannerOverlay} />
            <div className={styles.bannerContent}>
              <div className={styles.bannerText}>
                <h1 className={styles.bannerTitle}>{slide.title}</h1>
                <p className={styles.bannerSubtitle}>{slide.subtitle}</p>
                <button className={styles.bannerCta}>
                  {slide.ctaText}
                  <svg className={styles.ctaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        <button className={styles.prevButton} onClick={prevSlide}>
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button className={styles.nextButton} onClick={nextSlide}>
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className={styles.bannerDots}>
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentSlide ? styles.dotActive : ''
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}