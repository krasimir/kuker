import isDefined from './isDefined';
import renderJSONPreview from './renderJSONPreview';

export default function formatSide(side) {
  if (typeof side === 'object' && side !== null) {
    return renderJSONPreview(side);
  } else if (!isDefined(side)) {
    return null;
  }
  return String(side);
}
