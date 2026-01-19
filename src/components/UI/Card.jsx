// Reusable Card Component
export function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
