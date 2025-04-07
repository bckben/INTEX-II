import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './ContentRow.css';

interface ContentItem {
  id: number;
  title: string;
  imageUrl: string;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
}

const ContentRow: React.FC<ContentRowProps> = ({ title, items }) => {
  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="items-container">
        {items.map((item) => (
          <div key={item.id} className="content-item">
            <img 
              src={item.imageUrl || '/images/placeholder.jpg'} 
              alt={item.title} 
              className="item-image"
            />
            <div className="item-overlay">
              <h3 className="item-title">{item.title}</h3>
              <div className="item-actions">
                <button className="action-button">
                  <i className="bi bi-play-fill"></i>
                </button>
                <button className="action-button">
                  <i className="bi bi-plus"></i>
                </button>
                <button className="action-button">
                  <i className="bi bi-info-circle"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRow;