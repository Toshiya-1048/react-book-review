import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - ページが見つかりません</h1>
      <p className="mb-4">お探しのページは存在しないか、移動した可能性があります。</p>
      <Link to="/" className="text-blue-500 underline">ホームに戻る</Link>
    </div>
  );
};

export default NotFound;