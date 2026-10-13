import { Link } from 'react-router-dom';
import { IconBadge } from '../components/Icons';

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container center">
        <IconBadge name="dog" size="xl" className="lost-dog" />
        <h1>This page ran off with a bone.</h1>
        <p className="muted">We couldn’t find what you were sniffing for.</p>
        <Link to="/" className="btn btn-primary">Take me home</Link>
      </div>
    </section>
  );
}
