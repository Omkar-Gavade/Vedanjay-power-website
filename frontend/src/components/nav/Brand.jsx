import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { BrandMark } from './BrandMark.jsx';

export function Brand({ onClick }) {
  return (
    <Link to={ROUTES.home} className="vp-brand" aria-label="Vedanjay Power — home" onClick={onClick}>
      <BrandMark className="vp-brand__mark" />
      <span>
        <span className="vp-brand__name d-block">VEDANJAY</span>
        <span className="vp-brand__sub">POWER</span>
      </span>
    </Link>
  );
}
