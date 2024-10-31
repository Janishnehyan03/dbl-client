

// components/Wishlist.tsx
import React from 'react';

const Wishlist: React.FC = () => {
  const wishlistBooks = [
    { title: "Don't Make Me Think", author: 'Steve Krug', year: 2000 },
    { title: 'The Design of EveryDay Things', author: 'Don Norman', year: 1988 },
    { title: 'Rich Dad Poor Dad', author: 'Robert T.Kiyosaki', year: 1997 },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Wishlist</h3>
      <div className="flex space-x-4">
        {wishlistBooks.map((book, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow w-48">
            <div className="bg-gray-200 h-32 mb-2 rounded"></div>
            <h4 className="font-bold">{book.title}</h4>
            <p className="text-sm text-gray-600">{book.author}, {book.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;