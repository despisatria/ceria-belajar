import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  title: string;
  icon: string | React.ReactNode;
  colorClass: 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'cyan';
  link: string;
  description?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, colorClass, link, description }) => {
  return (
    <Link to={link} className={`${styles.card} ${styles[colorClass]}`}>
      <div className={styles.icon}>
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </Link>
  );
};

export default CategoryCard;
