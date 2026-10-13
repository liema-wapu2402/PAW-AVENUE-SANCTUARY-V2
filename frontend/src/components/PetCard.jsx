import { img } from '../api';
import Reveal from './Reveal';
import Icon from './Icons';

const LABEL = { available: 'Available', pending: 'Adoption pending', adopted: 'Adopted' };

export default function PetCard({ pet, onAdopt, delay = 0 }) {
  const adopted = pet.status === 'adopted';
  return (
    <Reveal anim="zoom" delay={delay} className="pet-card-wrap">
      <article className={`pet-card status-${pet.status}`}>
        <div className="pet-photo">
          <img src={img(pet.image)} alt={`${pet.name}, a ${pet.species}`} loading="lazy" />
          <span className="pet-species" title={pet.species}><Icon name={pet.species === 'dog' ? 'dog' : 'cat'} /></span>
          <span className="pet-status">{LABEL[pet.status]}</span>
        </div>
        <div className="pet-body">
          <div className="pet-title">
            <h3>{pet.name}</h3>
            <p className="pet-meta">{[pet.breed, pet.age, pet.gender].filter(Boolean).join(' · ')}</p>
          </div>
          {pet.description && <p className="pet-desc">{pet.description}</p>}
          {onAdopt && (
            <button className="btn btn-primary btn-block" disabled={adopted} onClick={() => onAdopt(pet)}>
              {adopted ? 'Found a home' : <>Adopt {pet.name} <Icon name="heart" className="btn-icon" /></>}
            </button>
          )}
        </div>
      </article>
    </Reveal>
  );
}
