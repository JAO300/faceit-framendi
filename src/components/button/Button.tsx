import './Button.scss';
import { Link } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
};

export default function Button({
  children,
  to,
  onClick,
  type = 'button',
}: Props) {
  if (to) {
    return (
      <Link to={to} className="btn">
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className="btn">
      {children}
    </button>
  );
}
