import React from 'react';
import './card.css';

function Container({ title, content, menu }) {
  return (
    <>
      <div className="card mx-auto mt-5">
        <div className="card-header text-center">
          <h3>{title}</h3>
        </div>

        <div className="card-body">
          {menu && <div className="mb-2">{menu}</div>}
          {content}
        </div>
      </div>
    </>
  );
}

export default Container;
